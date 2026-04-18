from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timezone
import logging
from pathlib import Path
from typing import Optional
from urllib.parse import quote
from uuid import uuid4

import httpx

from app.core.config import Settings
from app.schemas import FeedbackDetail, ScoreData

logger = logging.getLogger(__name__)


MIME_TYPE_TO_EXTENSION = {
    "audio/webm": ".webm",
    "audio/webm;codecs=opus": ".webm",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
    "audio/mpeg": ".mp3",
    "audio/mp3": ".mp3",
    "audio/mp4": ".m4a",
    "audio/m4a": ".m4a",
    "audio/x-m4a": ".m4a",
}


@dataclass
class SavedSpeakingAttempt:
    attempt_id: str
    audio_path: str
    audio_url: Optional[str]
    duration_seconds: Optional[float]
    transcript_word_count: int
    issue_summary: Optional[str]


class ScoreAttemptStore(ABC):
    @abstractmethod
    async def save_audio_score(
        self,
        *,
        user_id: str,
        prompt_type: str,
        question_text: Optional[str],
        reference_text: Optional[str],
        transcript: str,
        audio_bytes: bytes,
        audio_filename: Optional[str],
        mime_type: str,
        duration_seconds: Optional[float],
        result: ScoreData,
    ) -> SavedSpeakingAttempt:
        raise NotImplementedError


class SupabaseScoreAttemptStore(ScoreAttemptStore):
    def __init__(self, settings: Settings):
        self.settings = settings

    async def save_audio_score(
        self,
        *,
        user_id: str,
        prompt_type: str,
        question_text: Optional[str],
        reference_text: Optional[str],
        transcript: str,
        audio_bytes: bytes,
        audio_filename: Optional[str],
        mime_type: str,
        duration_seconds: Optional[float],
        result: ScoreData,
    ) -> SavedSpeakingAttempt:
        if not self.settings.supabase_url or not self.settings.supabase_service_role_key:
            raise RuntimeError("Supabase server credentials are not configured")

        attempt_id = str(uuid4())
        extension = self._resolve_extension(audio_filename, mime_type)
        date_segment = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        audio_path = f"{user_id}/{date_segment}/{attempt_id}{extension}"
        transcript_word_count = len([word for word in transcript.split() if word.strip()])
        feedback_summary, feedback_json, issue_summary = self._feedback_parts(result.feedback)

        async with httpx.AsyncClient(timeout=20.0) as client:
            await self._upload_audio(client, audio_path, audio_bytes, mime_type)
            try:
                await self._insert_attempt(
                    client,
                    {
                        "id": attempt_id,
                        "user_id": user_id,
                        "prompt_type": prompt_type,
                        "question_text": question_text,
                        "reference_text": reference_text,
                        "transcript": transcript,
                        "audio_path": audio_path,
                        "overall_score": result.overall,
                        "content_score": result.content,
                        "fluency_score": result.fluency,
                        "pronunciation_score": result.pronunciation,
                        "feedback_summary": feedback_summary,
                        "feedback_json": feedback_json,
                        "prompt_metadata": {
                            "prompt_type": prompt_type,
                            "question_text": question_text,
                            "reference_text": reference_text,
                        },
                        "duration_seconds": duration_seconds,
                        "transcript_word_count": transcript_word_count,
                        "issue_summary": issue_summary,
                    },
                )
            except Exception:
                await self._delete_audio(client, audio_path)
                raise

            audio_url = await self._create_signed_url(client, audio_path)

        return SavedSpeakingAttempt(
            attempt_id=attempt_id,
            audio_path=audio_path,
            audio_url=audio_url,
            duration_seconds=duration_seconds,
            transcript_word_count=transcript_word_count,
            issue_summary=issue_summary,
        )

    def _headers(self, extra: Optional[dict] = None) -> dict:
        headers = {
            "apikey": self.settings.supabase_service_role_key,
            "Authorization": f"Bearer {self.settings.supabase_service_role_key}",
        }
        if extra:
            headers.update(extra)
        return headers

    def _resolve_extension(self, audio_filename: Optional[str], mime_type: str) -> str:
        suffix = Path(audio_filename or "").suffix.lower()
        if suffix:
            return suffix
        return MIME_TYPE_TO_EXTENSION.get((mime_type or "").lower(), ".webm")

    def _feedback_parts(self, feedback: str | FeedbackDetail) -> tuple[str, dict, Optional[str]]:
        if isinstance(feedback, FeedbackDetail):
            feedback_json = feedback.model_dump()
            issue_summary = "; ".join(feedback.issues[:2]) or None
            return feedback.summary, feedback_json, issue_summary

        summary = str(feedback or "No feedback returned.")
        return summary, {"summary": summary}, None

    async def _upload_audio(self, client: httpx.AsyncClient, audio_path: str, audio_bytes: bytes, mime_type: str) -> None:
        upload_url = (
            f"{self.settings.supabase_url.rstrip('/')}/storage/v1/object/"
            f"{self.settings.supabase_bucket_name}/{quote(audio_path, safe='/')}"
        )
        response = await client.post(
            upload_url,
            content=audio_bytes,
            headers=self._headers(
                {
                    "Content-Type": mime_type or "application/octet-stream",
                    "x-upsert": "false",
                }
            ),
        )
        response.raise_for_status()

    async def _insert_attempt(self, client: httpx.AsyncClient, payload: dict) -> None:
        response = await client.post(
            f"{self.settings.supabase_url.rstrip('/')}/rest/v1/speaking_attempts",
            json=payload,
            headers=self._headers(
                {
                    "Content-Type": "application/json",
                    "Prefer": "return=representation",
                }
            ),
        )
        response.raise_for_status()

    async def _delete_audio(self, client: httpx.AsyncClient, audio_path: str) -> None:
        delete_url = (
            f"{self.settings.supabase_url.rstrip('/')}/storage/v1/object/"
            f"{self.settings.supabase_bucket_name}/{quote(audio_path, safe='/')}"
        )
        response = await client.delete(delete_url, headers=self._headers())
        if response.status_code >= 400 and response.status_code != 404:
            response.raise_for_status()

    async def _create_signed_url(self, client: httpx.AsyncClient, audio_path: str) -> Optional[str]:
        public_url = (
            f"{self.settings.supabase_url.rstrip('/')}/storage/v1/object/public/"
            f"{self.settings.supabase_bucket_name}/{quote(audio_path, safe='/')}"
        )
        try:
            response = await client.post(
                f"{self.settings.supabase_url.rstrip('/')}/storage/v1/object/sign/"
                f"{self.settings.supabase_bucket_name}/{quote(audio_path, safe='/')}",
                json={"expiresIn": 3600},
                headers=self._headers({"Content-Type": "application/json"}),
            )
            if response.status_code >= 400:
                logger.warning("Signed URL generation failed for %s with status %s. Falling back to public URL.", audio_path, response.status_code)
                return public_url

            payload = response.json()
            signed_path = payload.get("signedURL")
            if not signed_path:
                logger.warning("Signed URL response missing signedURL for %s. Falling back to public URL.", audio_path)
                return public_url
            if signed_path.startswith("http://") or signed_path.startswith("https://"):
                return signed_path
            if signed_path.startswith("/storage/v1/"):
                return f"{self.settings.supabase_url.rstrip('/')}{signed_path}"
            if signed_path.startswith("/object/"):
                return f"{self.settings.supabase_url.rstrip('/')}/storage/v1{signed_path}"
            return f"{self.settings.supabase_url.rstrip('/')}/storage/v1/{signed_path.lstrip('/')}"
        except Exception:
            logger.exception("Signed URL generation crashed for %s. Falling back to public URL.", audio_path)
            return public_url
