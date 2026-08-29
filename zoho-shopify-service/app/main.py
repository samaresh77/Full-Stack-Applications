from fastapi import FastAPI
from app.database import engine, Base
from app.routers import zoho, shopify

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zoho CRM & Shopify Integration Service",
    description="Independent integration microservice for Zoho CRM and Shopify APIs",
    version="1.0.0"
)

app.include_router(zoho.router, prefix="/zoho", tags=["Zoho CRM"])
app.include_router(shopify.router, prefix="/shopify", tags=["Shopify"])

@app.get("/health")
def health_check():
    return {"status": "ok"}