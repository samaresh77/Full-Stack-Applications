from app.zoho.token_service import refresh_zoho_access_token
from app.database.models import IntegrationToken
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.token_repository import save_zoho_tokens
from app.zoho.auth import (
    exchange_code_for_tokens,
    get_authorization_url,
)


router = APIRouter(
    prefix="/api/zoho/auth",
    tags=["Zoho Authentication"],
)


@router.get("/login")
def zoho_login():
    authorization_url = get_authorization_url()

    return RedirectResponse(url=authorization_url)


@router.get("/callback")
async def zoho_callback(
    code: str | None = Query(default=None),
    error: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if error:
        raise HTTPException(
            status_code=400,
            detail=f"Zoho authorization failed: {error}",
        )

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Authorization code was not provided by Zoho.",
        )

    try:
        tokens = await exchange_code_for_tokens(code)

        save_zoho_tokens(db, tokens)

        return {
            "message": "Zoho authentication successful",
            "token_received": bool(tokens.get("access_token")),
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Failed to authenticate with Zoho.",
        )

@router.get("/status")
def zoho_status(db: Session = Depends(get_db)):
    token = (
        db.query(IntegrationToken)
        .filter(IntegrationToken.provider == "zoho")
        .first()
    )

    if not token:
        return {
            "authenticated": False,
        }

    return {
        "authenticated": True,
        "provider": token.provider,
        "expires_at": token.expires_at,
        "api_domain": token.api_domain,
    }

@router.post("/refresh-test")
async def refresh_test(
    db: Session = Depends(get_db),
):
    token = (
        db.query(IntegrationToken)
        .filter(IntegrationToken.provider == "zoho")
        .first()
    )

    if not token:
        raise HTTPException(
            status_code=404,
            detail="Zoho authentication not found.",
        )

    try:
        await refresh_zoho_access_token(db, token)

        return {
            "message": "Zoho access token refreshed successfully"
        }

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Failed to refresh Zoho access token.",
        )