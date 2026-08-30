from fastapi import FastAPI

from app.api.zoho_routes import router as zoho_router
from app.api.zoho_contact_routes import router as zoho_contact_router
from app.api.zoho_lead_routes import router as zoho_lead_router
from app.api.shopify_auth_routes import router as shopify_auth_router
from app.core.config import settings
from app.database import models
from app.database.database import Base, engine
from app.api.shopify_customer_routes import (
    router as shopify_customer_router,
)


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


app.include_router(zoho_router)
app.include_router(zoho_contact_router)
app.include_router(zoho_lead_router)
app.include_router(shopify_auth_router)
app.include_router(shopify_customer_router)


@app.get("/")
def root():
    return {
        "message": "Zoho CRM & Shopify Integration Service is running",
        "version": settings.app_version,
    }