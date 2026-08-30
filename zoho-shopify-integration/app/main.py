from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base, engine
from app.database import models


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


@app.get("/")
def root():
    return {
        "message": "Zoho CRM & Shopify Integration Service is running",
        "version": settings.app_version,
    }