from fastapi import APIRouter, Depends, HTTPException

from app.schemas.lead import LeadCreate
from app.zoho.client import ZohoClient
from app.zoho.dependencies import get_zoho_client
from app.zoho.lead_service import LeadService


router = APIRouter(
    prefix="/api/zoho/leads",
    tags=["Zoho Leads"],
)


@router.post("")
async def create_lead(
    lead: LeadCreate,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = LeadService(client)

        result = await service.create_lead(lead)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho create lead error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )


@router.get("")
async def list_leads(
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = LeadService(client)

        result = await service.list_leads()

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho list leads error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )


@router.get("/{lead_id}")
async def get_lead(
    lead_id: str,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = LeadService(client)

        result = await service.get_lead(lead_id)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho get lead error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )