from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import IntegrationToken
from app.zoho.token_service import get_valid_zoho_access_token
from app.zoho.client import ZohoClient


async def get_zoho_client(
    db: Session = Depends(get_db),
) -> ZohoClient:
    access_token = await get_valid_zoho_access_token(db)

    token = (
        db.query(IntegrationToken)
        .filter(IntegrationToken.provider == "zoho")
        .first()
    )

    if not token or not token.api_domain:
        raise ValueError("Zoho API domain is not available.")

    return ZohoClient(
        api_domain=token.api_domain,
        access_token=access_token,
    )