from fastapi import APIRouter, Depends, HTTPException

from app.schemas.zoho import ContactCreate
from app.zoho.client import ZohoClient
from app.zoho.dependencies import get_zoho_client
from app.zoho.contact_service import ContactService, ContactUpdate


router = APIRouter(
    prefix="/api/zoho/contacts",
    tags=["Zoho Contacts"],
)


@router.post("")
async def create_contact(
    contact: ContactCreate,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = ContactService(client)

        result = await service.create_contact(contact)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(f"Zoho create contact error: {type(exc).__name__}: {exc}")

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )

@router.get("/{contact_id}")
async def get_contact(
    contact_id: str,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = ContactService(client)

        result = await service.get_contact(contact_id)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho get contact error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )

@router.get("")
async def list_contacts(
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = ContactService(client)

        result = await service.list_contacts()

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho list contacts error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )

@router.put("/{contact_id}")
async def update_contact(
    contact_id: str,
    contact: ContactUpdate,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = ContactService(client)

        result = await service.update_contact(
            contact_id,
            contact,
        )

        return {
            "success": True,
            "data": result,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print(
            f"Zoho update contact error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: str,
    client: ZohoClient = Depends(get_zoho_client),
):
    try:
        service = ContactService(client)

        result = await service.delete_contact(contact_id)

        return {
            "success": True,
            "data": result,
        }

    except Exception as exc:
        print(
            f"Zoho delete contact error: "
            f"{type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=502,
            detail=f"Zoho API request failed: {exc}",
        )