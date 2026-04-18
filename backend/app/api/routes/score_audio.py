from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse
from google.api_core.exceptions import InvalidArgument, PermissionDenied, ResourceExhausted

from app.core.config import Settings, get_settings
from app.core.security import AuthenticatedUser, check_daily_limit, get_current_user, should_rate_limit
from app.schemas import ErrorResponse, ScoreRequest, ScoreSuccessResponse
from app.services.ai_provider import AIProvider
from app.services.dependencies import get_ai_provider, get_attempt_store, get_stt_provider
from app.services.prompt_builder import build_prompt
from app.services.score_attempt_store import ScoreAttemptStore
from app.services.stt_provider import STTProvider

router = APIRouter(tags=["audio-scoring"])
logger = logging.getLogger(__name__)

ALLOWED_AUDIO_EXTENSIONS = {".webm", ".wav", ".mp3", ".m4a", ".mp4", ".aac"}
ALLOWED_AUDIO_MIME_TYPES = {
    "audio/webm",
    "audio/webm;codecs=opus",
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/m4a",
    "audio/x-m4a",
    "audio/aac",
    "audio/aacp",
    "audio/x-aac",
    "audio/3gpp",
    "audio/3gpp2",
}


def validate_audio_upload(file: UploadFile, config: Settings) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    mime_type = (file.content_type or "").lower()
    logger.info(
        "Validating audio upload: filename=%s suffix=%s content_type=%s",
        file.filename,
        suffix or "<none>",
        mime_type or "<none>",
    )
    is_audio_mime = mime_type.startswith("audio/") if mime_type else False
    if suffix and suffix not in ALLOWED_AUDIO_EXTENSIONS and not is_audio_mime:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please upload a supported audio file such as webm, wav, mp3, m4a, mp4, or aac.")
    if mime_type and mime_type not in ALLOWED_AUDIO_MIME_TYPES and not mime_type.startswith("audio/mp4;") and not is_audio_mime:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="That audio format is not supported yet.")


def error_response(status_code: int, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=ErrorResponse(success=False, error=message).model_dump(),
    )


@router.post(
    "/api/score-audio",
    response_model=ScoreSuccessResponse,
    responses={401: {"model": ErrorResponse}, 429: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def score_audio_response(
    file: UploadFile = File(...),
    promptType: str = Form(...),
    questionText: Optional[str] = Form(default=None),
    referenceAnswer: Optional[str] = Form(default=None),
    task: str = Form(default="speaking"),
    mimeType: Optional[str] = Form(default=None),
    sampleRateHertz: Optional[int] = Form(default=None),
    durationSeconds: Optional[float] = Form(default=None),
    appLanguage: str = Form(default="en"),
    user: AuthenticatedUser = Depends(get_current_user),
    config: Settings = Depends(get_settings),
    ai_provider: AIProvider = Depends(get_ai_provider),
    stt_provider: STTProvider = Depends(get_stt_provider),
    attempt_store: ScoreAttemptStore = Depends(get_attempt_store),
):
    print("Received /api/score-audio request")
    logger.info(
        "Received audio request for /api/score-audio: filename=%s content_type=%s mimeType=%s sampleRateHertz=%s durationSeconds=%s",
        file.filename,
        file.content_type,
        mimeType,
        sampleRateHertz,
        durationSeconds,
    )
    if should_rate_limit(user.user_id):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    if not check_daily_limit(user.user_id, config):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Daily AI scoring limit reached")
    if not config.gemini_api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server AI provider is not configured")

    validate_audio_upload(file, config)
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please choose an audio file before submitting.")
    if len(audio_bytes) > config.max_audio_file_bytes:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please keep audio files under 10 MB.")
    if durationSeconds and durationSeconds > config.max_audio_duration_seconds:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please keep recordings under 60 seconds for now.")

    try:
        transcript = await stt_provider.transcribe(
            audio_bytes=audio_bytes,
            mime_type=mimeType or file.content_type or "audio/webm",
            sample_rate_hertz=sampleRateHertz,
            language_code=config.google_stt_language_code,
        )
        if not transcript.strip():
            return error_response(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Speech transcription returned no result.",
            )

        payload = ScoreRequest(
            task=task,
            promptType=promptType,
            transcript=transcript,
            questionText=questionText,
            referenceAnswer=referenceAnswer,
            appLanguage=appLanguage,
        )
        prompt = build_prompt(payload)
        result = await ai_provider.score(prompt)
        result.transcript = transcript

        try:
            saved_attempt = await attempt_store.save_audio_score(
                user_id=user.user_id,
                prompt_type=promptType,
                question_text=questionText,
                reference_text=referenceAnswer or questionText,
                transcript=transcript,
                audio_bytes=audio_bytes,
                audio_filename=file.filename,
                mime_type=mimeType or file.content_type or "audio/webm",
                duration_seconds=durationSeconds,
                result=result,
            )
        except Exception:
            logger.exception("Failed to persist speaking attempt after scoring succeeded")
            return error_response(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="AI scoring completed, but saving the attempt failed. Please try again.",
            )
        result.attemptId = saved_attempt.attempt_id
        result.audioPath = saved_attempt.audio_path
        result.audioUrl = saved_attempt.audio_url
        result.durationSeconds = saved_attempt.duration_seconds
        result.transcriptWordCount = saved_attempt.transcript_word_count
        result.issueSummary = saved_attempt.issue_summary

        return ScoreSuccessResponse(success=True, data=result)
    except PermissionDenied:
        logger.exception("Speech-to-Text permission denied during /api/score-audio")
        return error_response(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Speech-to-Text is not enabled or billing is not configured.",
        )
    except InvalidArgument:
        logger.exception("Invalid argument during /api/score-audio")
        return error_response(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Audio format is not supported.",
        )
    except ResourceExhausted:
        logger.exception("Resource exhausted during /api/score-audio")
        return error_response(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            message="AI scoring failed. Please try again.",
        )
    except Exception:
        logger.exception("Unexpected error during /api/score-audio")
        return error_response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="AI scoring failed. Please try again.",
        )
