from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.routes.score import router as score_router
from app.api.routes.score_audio import router as score_audio_router
from app.core.config import get_settings
from app.schemas import ErrorResponse


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="PTE AI Scoring API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(_request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(success=False, error=str(exc.detail)).model_dump(),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(_request, _exc: Exception):
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(success=False, error="AI scoring service is temporarily unavailable.").model_dump(),
        )

    @app.get("/health")
    async def healthcheck():
        return {"ok": True}

    app.include_router(score_router)
    app.include_router(score_audio_router)
    return app


app = create_app()
