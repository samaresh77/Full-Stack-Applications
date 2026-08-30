from datetime import datetime, timedelta, timezone

import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.models import IntegrationToken


ZOHO_ACCOUNTS_URL = "https://accounts.zoho.in"


def get_zoho_token_record(db: Session) -> IntegrationToken:
    token = (
        db.query(IntegrationToken)
        .filter(IntegrationToken.provider == "zoho")
        .first()
    )

    if not token:
        raise ValueError(
            "Zoho is not authenticated. Please authorize the application first."
        )

    return token


def is_token_valid(token: IntegrationToken) -> bool:
    if not token.expires_at:
        return False

    now = datetime.now(timezone.utc)

    expires_at = token.expires_at

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    # Refresh slightly before the real expiration time.
    safety_margin = timedelta(minutes=5)

    return now < expires_at - safety_margin


async def refresh_zoho_access_token(
    db: Session,
    token: IntegrationToken,
) -> str:
    if not token.refresh_token:
        raise ValueError(
            "Zoho refresh token is not available. Reauthorization is required."
        )

    token_url = f"{ZOHO_ACCOUNTS_URL}/oauth/v2/token"

    data = {
        "refresh_token": token.refresh_token,
        "client_id": settings.zoho_client_id,
        "client_secret": settings.zoho_client_secret,
        "grant_type": "refresh_token",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            token_url,
            data=data,
            timeout=30.0,
        )

    response.raise_for_status()

    response_data = response.json()

    new_access_token = response_data.get("access_token")
    expires_in = response_data.get("expires_in")
    api_domain = response_data.get("api_domain")

    if not new_access_token:
        raise ValueError(
            "Zoho did not return a new access token."
        )

    token.access_token = new_access_token

    if expires_in:
        token.expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=int(expires_in)
        )

    if api_domain:
        token.api_domain = api_domain

    db.commit()
    db.refresh(token)

    return token.access_token


async def get_valid_zoho_access_token(
    db: Session,
) -> str:
    token = get_zoho_token_record(db)

    if is_token_valid(token):
        return token.access_token

    return await refresh_zoho_access_token(db, token)