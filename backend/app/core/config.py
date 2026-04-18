from __future__ import annotations

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=False)

    gemini_api_key: str = Field(default="")
    # Production should use a current stable Gemini model such as gemini-2.5-flash.
    gemini_model: str = Field(default="gemini-2.5-flash")
    gemini_temperature: float = Field(default=0.2)
    google_cloud_project: str = Field(default="")
    google_application_credentials: str = Field(default="")
    google_stt_language_code: str = Field(default="en-US")
    google_stt_sample_rate_hertz: int = Field(default=48000)
    frontend_origins: str = Field(default="http://localhost:3000")
    supabase_url: str = Field(default="")
    supabase_service_role_key: str = Field(default="")
    supabase_bucket_name: str = Field(default="speaking-recordings")
    supabase_jwt_secret: str = Field(default="")
    allow_mock_auth: bool = Field(default=True)
    mock_user_id: str = Field(default="local-dev-user")
    mock_access_token: str = Field(default="dev-local-token")
    daily_scoring_limit: int = Field(default=20)
    gemini_timeout_seconds: float = Field(default=15.0)
    max_audio_duration_seconds: int = Field(default=60)
    max_audio_file_bytes: int = Field(default=10 * 1024 * 1024)

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.frontend_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
