from urllib.parse import urlencode

import httpx

from app.core.config import settings


ZOHO_ACCOUNTS_URL = "https://accounts.zoho.in"

ZOHO_SCOPES = [
    "ZohoCRM.modules.contacts.ALL",
    "ZohoCRM.modules.leads.READ",
    "ZohoCRM.modules.leads.CREATE",
]


def get_authorization_url() -> str:
    params = {
        "scope": ",".join(ZOHO_SCOPES),
        "client_id": settings.zoho_client_id,
        "response_type": "code",
        "access_type": "offline",
        "redirect_uri": settings.zoho_redirect_uri,
    }

    return f"{ZOHO_ACCOUNTS_URL}/oauth/v2/auth?{urlencode(params)}"


async def exchange_code_for_tokens(code: str) -> dict:
    token_url = f"{ZOHO_ACCOUNTS_URL}/oauth/v2/token"

    data = {
        "code": code,
        "client_id": settings.zoho_client_id,
        "client_secret": settings.zoho_client_secret,
        "redirect_uri": settings.zoho_redirect_uri,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)

    response.raise_for_status()

    return response.json()