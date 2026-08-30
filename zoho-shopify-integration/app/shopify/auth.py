import time

import httpx

from app.core.config import settings


class ShopifyAuth:
    def __init__(self):
        self.access_token: str | None = None
        self.expires_at: float = 0

    async def get_access_token(self) -> str:
        # Reuse the token if it is still valid
        if (
            self.access_token
            and time.time() < self.expires_at - 60
        ):
            return self.access_token

        url = (
            f"https://{settings.shopify_shop_domain}"
            "/admin/oauth/access_token"
        )

        data = {
            "grant_type": "client_credentials",
            "client_id": settings.shopify_client_id,
            "client_secret": settings.shopify_client_secret,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data=data,
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Shopify returned HTTP "
                f"{response.status_code}: "
                f"{response.text}"
            )

        result = response.json()

        self.access_token = result["access_token"]
        self.expires_at = (
            time.time() + result["expires_in"]
        )

        return self.access_token