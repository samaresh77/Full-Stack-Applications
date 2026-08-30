from fastapi import APIRouter, Depends, HTTPException

from app.schemas.shopify import CustomerCreate, CustomerUpdate
from app.shopify.auth import ShopifyAuth
from app.shopify.client import ShopifyClient
from app.shopify.customer_service import CustomerService


router = APIRouter(
    prefix="/api/shopify/customers",
    tags=["Shopify Customers"],
)


shopify_auth = ShopifyAuth()


def get_shopify_client() -> ShopifyClient:
    return ShopifyClient(shopify_auth)


@router.post("")
async def create_customer(
    customer: CustomerCreate,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = CustomerService(client)

        result = await service.create_customer(customer)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify create customer error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )

@router.get("/{customer_id}")
async def get_customer(
    customer_id: int,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = CustomerService(client)

        result = await service.get_customer(customer_id)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify get customer error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )

@router.get("")
async def list_customers(
    limit: int = 50,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = CustomerService(client)

        result = await service.list_customers(limit)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify list customers error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )

@router.put("/{customer_id}")
async def update_customer(
    customer_id: int,
    customer: CustomerUpdate,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = CustomerService(client)

        result = await service.update_customer(
            customer_id,
            customer,
        )

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify update customer error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )