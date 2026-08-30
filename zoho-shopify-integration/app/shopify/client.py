import httpx

from app.core.config import settings
from app.shopify.auth import ShopifyAuth


class ShopifyClient:
    def __init__(self, auth: ShopifyAuth):
        self.auth = auth

    async def create_customer(self, data: dict) -> dict:
        access_token = await self.auth.get_access_token()

        url = (
            f"https://{settings.shopify_shop_domain}"
            f"/admin/api/{settings.shopify_api_version}"
            "/customers.json"
        )

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers={
                    "X-Shopify-Access-Token": access_token,
                    "Content-Type": "application/json",
                },
                json={
                    "customer": data,
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Shopify returned HTTP "
                f"{response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def get_customer(self, customer_id: int) -> dict:
        access_token = await self.auth.get_access_token()

        url = (
            f"https://{settings.shopify_shop_domain}"
            f"/admin/api/{settings.shopify_api_version}"
            f"/customers/{customer_id}.json"
        )

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={
                    "X-Shopify-Access-Token": access_token,
                    "Content-Type": "application/json",
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Shopify returned HTTP "
                f"{response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def list_customers(self, limit: int = 50) -> dict:
        access_token = await self.auth.get_access_token()

        url = (
            f"https://{settings.shopify_shop_domain}"
            f"/admin/api/{settings.shopify_api_version}"
            "/customers.json"
        )

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers={
                    "X-Shopify-Access-Token": access_token,
                    "Content-Type": "application/json",
                },
                params={
                    "limit": limit,
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Shopify returned HTTP "
                f"{response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def update_customer(
        self,
        customer_id: int,
        data: dict,
    ) -> dict:
        access_token = await self.auth.get_access_token()

        url = (
            f"https://{settings.shopify_shop_domain}"
            f"/admin/api/{settings.shopify_api_version}"
            f"/customers/{customer_id}.json"
        )

        async with httpx.AsyncClient() as client:
            response = await client.put(
                url,
                headers={
                    "X-Shopify-Access-Token": access_token,
                    "Content-Type": "application/json",
                },
                json={
                    "customer": data,
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Shopify returned HTTP "
                f"{response.status_code}: "
                f"{response.text}"
            )

        return response.json()