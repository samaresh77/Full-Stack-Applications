from app.schemas.shopify import CustomerCreate, CustomerUpdate
from app.shopify.client import ShopifyClient


class CustomerService:
    def __init__(self, client: ShopifyClient):
        self.client = client

    async def create_customer(
        self,
        customer: CustomerCreate,
    ) -> dict:
        data = {
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": str(customer.email),
        }

        if customer.phone:
            data["phone"] = customer.phone

        return await self.client.create_customer(data)

    async def get_customer(self, customer_id: int) -> dict:
        return await self.client.get_customer(customer_id)

    async def list_customers(self, limit: int = 50) -> dict:
        return await self.client.list_customers(limit)

    async def update_customer(
        self,
        customer_id: int,
        customer: CustomerUpdate,
    ) -> dict:
        data = customer.model_dump(
            exclude_none=True
        )

        if "email" in data:
            data["email"] = str(data["email"])

        return await self.client.update_customer(
            customer_id,
            data,
        )