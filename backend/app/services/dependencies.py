from __future__ import annotations

from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.ai_provider import AIProvider
from app.services.gemini_provider import GeminiProvider
from app.services.google_speech_provider import GoogleSpeechProvider
from app.services.score_attempt_store import ScoreAttemptStore, SupabaseScoreAttemptStore
from app.services.stt_provider import STTProvider


def get_ai_provider(config: Settings = Depends(get_settings)) -> AIProvider:
    return GeminiProvider(config)


def get_stt_provider(config: Settings = Depends(get_settings)) -> STTProvider:
    return GoogleSpeechProvider(config)


def get_attempt_store(config: Settings = Depends(get_settings)) -> ScoreAttemptStore:
    return SupabaseScoreAttemptStore(config)
