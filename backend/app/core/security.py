from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from typing import Optional

import httpx
from fastapi import Depends, Header, HTTPException, status

from app.core.config import Settings, get_settings


@dataclass
class AuthenticatedUser:
    user_id: str


def _base64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")


def _verify_hs256_token(token: str, secret: str) -> Optional[dict]:
    try:
        header_segment, payload_segment, signature_segment = token.split(".")
    except ValueError:
        return None

    signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
    expected_signature = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    actual_signature = _base64url_decode(signature_segment)
    if not hmac.compare_digest(expected_signature, actual_signature):
        return None

    try:
        header = json.loads(_base64url_decode(header_segment))
        payload = json.loads(_base64url_decode(payload_segment))
    except (ValueError, json.JSONDecodeError):
        return None

    if header.get("alg") != "HS256":
        return None

    expires_at = payload.get("exp")
    if expires_at is not None:
        try:
            if int(expires_at) <= int(time.time()):
                return None
        except (TypeError, ValueError):
            return None

    return payload


async def _verify_with_supabase_auth(token: str, config: Settings) -> Optional[str]:
    if not token or not config.supabase_url:
        return None

    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": config.supabase_service_role_key or "",
    }
    url = f"{config.supabase_url.rstrip('/')}/auth/v1/user"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=headers)
            if response.status_code >= 400:
                return None
            payload = response.json()
    except Exception:
        return None

    subject = str(payload.get("id") or payload.get("sub") or "").strip()
    return subject or None


async def verify_access_token(token: str, config: Settings) -> Optional[str]:
    if token and config.supabase_jwt_secret:
        payload = _verify_hs256_token(token, config.supabase_jwt_secret)
        subject = str(payload.get("sub") or "").strip() if payload else ""
        if subject:
            return subject

    subject = await _verify_with_supabase_auth(token, config)
    if subject:
        return subject

    if token and config.allow_mock_auth and token == config.mock_access_token:
        return config.mock_user_id

    return None


async def get_current_user(
    authorization: Optional[str] = Header(default=None),
    config: Settings = Depends(get_settings),
) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to use AI scoring")

    token = authorization.removeprefix("Bearer ").strip()
    user_id = await verify_access_token(token, config)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in to use AI scoring")
    return AuthenticatedUser(user_id=user_id)


def check_daily_limit(_user_id: str, _config: Settings) -> bool:
    # Reserved for real persistence-backed quota checks.
    return True


def should_rate_limit(_user_id: str) -> bool:
    # Reserved for future IP/user throttling.
    return False
