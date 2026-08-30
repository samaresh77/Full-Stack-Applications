from app.shopify.client import ShopifyClient


class OrderService:
    def __init__(self, client: ShopifyClient):
        self.client = client

    async def list_orders(self, limit: int = 50) -> dict:
        return await self.client.list_orders(limit)

    async def get_order(self, order_id: int) -> dict:
        return await self.client.get_order(order_id)