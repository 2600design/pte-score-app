import os
from typing import Optional

from google.cloud import speech

from app.core.config import Settings
from app.services.stt_provider import STTProvider


class GoogleSpeechProvider(STTProvider):
    def __init__(self, settings: Settings):
        self.settings = settings
        if settings.google_application_credentials:
            os.environ.setdefault("GOOGLE_APPLICATION_CREDENTIALS", settings.google_application_credentials)
        self.client = speech.SpeechClient()

    async def transcribe(
        self,
        audio_bytes: bytes,
        mime_type: str,
        sample_rate_hertz: Optional[int] = None,
        language_code: Optional[str] = None,
    ) -> str:
        config = speech.RecognitionConfig(
            encoding=self._resolve_encoding(mime_type),
            sample_rate_hertz=sample_rate_hertz or self.settings.google_stt_sample_rate_hertz,
            language_code=language_code or self.settings.google_stt_language_code,
            enable_automatic_punctuation=True,
            model="latest_long",
        )
        audio = speech.RecognitionAudio(content=audio_bytes)
        response = self.client.recognize(config=config, audio=audio)
        transcripts = [
            result.alternatives[0].transcript.strip()
            for result in response.results
            if result.alternatives and result.alternatives[0].transcript.strip()
        ]
        return " ".join(transcripts).strip()

    def _resolve_encoding(self, mime_type: str):
        normalized = (mime_type or "").lower()
        if "webm" in normalized:
            return speech.RecognitionConfig.AudioEncoding.WEBM_OPUS
        if "wav" in normalized:
            return speech.RecognitionConfig.AudioEncoding.LINEAR16
        if "m4a" in normalized or "mp4" in normalized:
            return speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        if "mpeg" in normalized or "mp3" in normalized:
            return speech.RecognitionConfig.AudioEncoding.MP3
        return speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
