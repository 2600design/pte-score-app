from __future__ import annotations

import json
import re

import httpx
from fastapi import HTTPException, status

from app.core.config import Settings
from app.schemas import FeedbackDetail, ScoreData
from app.services.ai_provider import AIProvider


class GeminiProvider(AIProvider):
    def __init__(self, settings: Settings):
        self.settings = settings

    async def score(self, prompt: str) -> ScoreData:
        if prompt.startswith('{"overall"'):
            return self._coerce_score_data(json.loads(prompt))

        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{self.settings.gemini_model}:generateContent"
        )
        params = {"key": self.settings.gemini_api_key}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": self.settings.gemini_temperature,
                "response_mime_type": "application/json",
            },
        }

        async with httpx.AsyncClient(timeout=self.settings.gemini_timeout_seconds) as client:
            try:
                response = await client.post(url, params=params, json=payload)
                if response.status_code >= 400:
                    print("Gemini status:", response.status_code)
                    print("Gemini response body:", response.text)
                response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                if exc.response.status_code == status.HTTP_400_BAD_REQUEST:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Gemini scoring request failed.",
                    ) from exc
                if exc.response.status_code == status.HTTP_404_NOT_FOUND:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Configured Gemini model is unavailable. Please update the model name.",
                    ) from exc
                if exc.response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE:
                    raise HTTPException(
                        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                        detail="The AI model is currently busy. Please wait a moment and try again.",
                    ) from exc
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Gemini scoring request failed.",
                ) from exc
            data = response.json()

        text = (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )
        parsed = self._safe_parse_json(text)
        return self._coerce_score_data(parsed)

    def _safe_parse_json(self, raw_text: str) -> dict:
        try:
            return json.loads(raw_text)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", raw_text, re.DOTALL)
            if not match:
                raise ValueError("Model returned non-JSON content")
            return json.loads(match.group(0))

    def _coerce_score_data(self, payload: dict) -> ScoreData:
        def as_score(value):
            if value is None:
                return None
            try:
                number = int(round(float(value)))
            except (TypeError, ValueError):
                return None
            return max(10, min(90, number))

        return ScoreData(
            overall=as_score(payload.get("overall")) or 10,
            content=as_score(payload.get("content")),
            fluency=as_score(payload.get("fluency")),
            pronunciation=as_score(payload.get("pronunciation")),
            grammar=as_score(payload.get("grammar")),
            spelling=as_score(payload.get("spelling")),
            vocabulary=as_score(payload.get("vocabulary")),
            feedback=self._coerce_feedback(payload.get("feedback")),
            transcript=payload.get("transcript"),
        )

    def _coerce_feedback(self, payload):
        if isinstance(payload, dict):
            return FeedbackDetail(
                summary=str(payload.get("summary") or "No feedback returned."),
                issues=[str(item) for item in (payload.get("issues") or []) if str(item).strip()],
                improvements=[str(item) for item in (payload.get("improvements") or []) if str(item).strip()],
                example_fix=str(payload.get("example_fix") or ""),
            )
        return str(payload or "No feedback returned.")
