from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.database.models import IntegrationToken


def save_zoho_tokens(
    db: Session,
    tokens: dict,
) -> IntegrationToken:
    access_token = tokens.get("access_token")
    refresh_token = tokens.get("refresh_token")
    expires_in = tokens.get("expires_in")
    api_domain = tokens.get("api_domain")

    if not access_token:
        raise ValueError("Zoho did not return an access token.")

    expires_at = None

    if expires_in:
        expires_at = datetime.now(timezone.utc) + timedelta(
            seconds=int(expires_in)
        )

    existing_token = (
        db.query(IntegrationToken)
        .filter(IntegrationToken.provider == "zoho")
        .first()
    )

    if existing_token:
        existing_token.access_token = access_token

        if refresh_token:
            existing_token.refresh_token = refresh_token

        existing_token.expires_at = expires_at
        existing_token.api_domain = api_domain

        db.commit()
        db.refresh(existing_token)

        return existing_token

    token_record = IntegrationToken(
        provider="zoho",
        access_token=access_token,
        refresh_token=refresh_token,
        expires_at=expires_at,
        api_domain=api_domain,
    )

    db.add(token_record)
    db.commit()
    db.refresh(token_record)

    return token_record