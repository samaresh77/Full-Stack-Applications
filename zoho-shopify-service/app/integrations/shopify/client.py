import os
import httpx
from fastapi import HTTPException

class ShopifyClient:
    def __init__(self):
        self.domain = os.getenv("SHOPIFY_STORE_DOMAIN")
        self.token = os.getenv("SHOPIFY_ADMIN_API_TOKEN")
        self.version = os.getenv("SHOPIFY_API_VERSION", "2024-01")
        self.base_url = f"https://{self.domain}/admin/api/{self.version}"

    async def request(self, method: str, endpoint: str, json_data: dict = None, params: dict = None):
        headers = {
            "X-Shopify-Access-Token": self.token,
            "Content-Type": "application/json"
        }
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.request(method, url, headers=headers, json=json_data, params=params, timeout=10.0)
                if response.status_code >= 400:
                    raise HTTPException(status_code=response.status_code, detail=response.json())
                return response.json()
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Shopify Service Unavailable: {str(exc)}")