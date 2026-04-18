from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.core.security import AuthenticatedUser, check_daily_limit, get_current_user, should_rate_limit
from app.schemas import ErrorResponse, ScoreRequest, ScoreSuccessResponse
from app.services.ai_provider import AIProvider
from app.services.dependencies import get_ai_provider
from app.services.prompt_builder import build_prompt

router = APIRouter(tags=["scoring"])
logger = logging.getLogger(__name__)


@router.post(
    "/api/score",
    response_model=ScoreSuccessResponse,
    responses={401: {"model": ErrorResponse}, 429: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def score_response(
    payload: ScoreRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    config: Settings = Depends(get_settings),
    provider: AIProvider = Depends(get_ai_provider),
):
    print("Received /api/score request")
    logger.info("Received request for /api/score")
    if should_rate_limit(user.user_id):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
    if not check_daily_limit(user.user_id, config):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Daily AI scoring limit reached")
    if not config.gemini_api_key:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Server AI provider is not configured")

    prompt = build_prompt(payload)
    result = await provider.score(prompt)
    return ScoreSuccessResponse(success=True, data=result)
