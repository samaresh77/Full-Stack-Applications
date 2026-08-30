from fastapi import APIRouter, HTTPException

from app.shopify.auth import ShopifyAuth


router = APIRouter(
    prefix="/api/shopify",
    tags=["Shopify"],
)


shopify_auth = ShopifyAuth()


@router.get("/auth/test")
async def test_shopify_auth():
    try:
        token = await shopify_auth.get_access_token()

        return {
            "success": True,
            "authenticated": True,
            "token_received": bool(token),
        }

    except Exception as exc:
        print(
            f"Shopify authentication error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Shopify authentication failed: {exc}",
        )