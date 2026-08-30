from fastapi import APIRouter, Depends, HTTPException

from app.shopify.auth import ShopifyAuth
from app.shopify.client import ShopifyClient
from app.shopify.order_service import OrderService


router = APIRouter(
    prefix="/api/shopify/orders",
    tags=["Shopify Orders"],
)


shopify_auth = ShopifyAuth()


def get_shopify_client() -> ShopifyClient:
    return ShopifyClient(shopify_auth)


@router.get("")
async def list_orders(
    limit: int = 50,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = OrderService(client)

        result = await service.list_orders(limit)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify list orders error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )


@router.get("/{order_id}")
async def get_order(
    order_id: int,
    client: ShopifyClient = Depends(get_shopify_client),
):
    try:
        service = OrderService(client)

        result = await service.get_order(order_id)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Shopify get order error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify API request failed: {exc}",
        )