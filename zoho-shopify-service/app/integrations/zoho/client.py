import os
from datetime import datetime, timedelta
import httpx
from fastapi import HTTPException
from app.database import SessionLocal
from app.models.token import OAuthToken

class ZohoClient:
    def __init__(self):
        self.client_id = os.getenv("ZOHO_CLIENT_ID")
        self.client_secret = os.getenv("ZOHO_CLIENT_SECRET")
        self.refresh_token = os.getenv("ZOHO_REFRESH_TOKEN")
        self.accounts_url = os.getenv("ZOHO_ACCOUNTS_URL", "https://accounts.zoho.in")
        self.api_base_url = os.getenv("ZOHO_API_BASE_URL", "https://www.zohoapis.in/crm/v2")

    async def get_valid_access_token(self) -> str:
        db = SessionLocal()
        try:
            token_rec = db.query(OAuthToken).filter(OAuthToken.provider == "zoho").first()
            if token_rec and token_rec.expires_at > datetime.utcnow() + timedelta(minutes=2):
                return token_rec.access_token

            # Refresh token
            url = f"{self.accounts_url}/oauth/v2/token"
            params = {
                "refresh_token": self.refresh_token,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "grant_type": "refresh_token"
            }
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, params=params)
                data = resp.json()
                if "access_token" not in data:
                    raise HTTPException(status_code=502, detail=f"Zoho token error: {data}")

                new_token = data["access_token"]
                expires_in = data.get("expires_in", 3600)

                if not token_rec:
                    token_rec = OAuthToken(provider="zoho", access_token=new_token, expires_at=datetime.utcnow() + timedelta(seconds=expires_in))
                    db.add(token_rec)
                else:
                    token_rec.access_token = new_token
                    token_rec.expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
                db.commit()
                return new_token
        finally:
            db.close()

    async def request(self, method: str, endpoint: str, json_data: dict = None, params: dict = None):
        access_token = await self.get_valid_access_token()
        headers = {"Authorization": f"Zoho-oauthtoken {access_token}"}
        url = f"{self.api_base_url}/{endpoint.lstrip('/')}"

        async with httpx.AsyncClient() as client:
            try:
                response = await client.request(method, url, headers=headers, json=json_data, params=params, timeout=10.0)
                if response.status_code == 204:
                    return []
                response_data = response.json()
                if response.status_code >= 400:
                    raise HTTPException(status_code=response.status_code, detail=response_data)
                return response_data
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Zoho Service Unavailable: {str(exc)}")