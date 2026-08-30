from app.schemas.zoho import ContactCreate, ContactUpdate
from app.zoho.client import ZohoClient


class ContactService:
    def __init__(self, client: ZohoClient):
        self.client = client

    async def create_contact(
        self,
        contact: ContactCreate,
    ) -> dict:
        data = {
            "First_Name": contact.first_name,
            "Last_Name": contact.last_name,
            "Email": str(contact.email),
        }

        if contact.phone:
            data["Phone"] = contact.phone

        if contact.company:
            data["Account_Name"] = {
                "name": contact.company
            }

        return await self.client.create_contact(data)

    async def get_contact(
        self,
        contact_id: str,
    ) -> dict:
        return await self.client.get_contact(contact_id)

    async def list_contacts(self) -> dict:
        return await self.client.list_contacts()

    async def update_contact(
        self,
        contact_id: str,
        contact: ContactUpdate,
    ) -> dict:
        data = {}

        if contact.first_name is not None:
            data["First_Name"] = contact.first_name

        if contact.last_name is not None:
            data["Last_Name"] = contact.last_name

        if contact.email is not None:
            data["Email"] = str(contact.email)

        if contact.phone is not None:
            data["Phone"] = contact.phone

        if contact.company is not None:
            data["Account_Name"] = {
                "name": contact.company
            }

        if not data:
            raise ValueError(
                "At least one field must be provided for update."
            )

        return await self.client.update_contact(
            contact_id,
            data,
        )

    async def delete_contact(
        self,
        contact_id: str,
    ) -> dict:
        return await self.client.delete_contact(contact_id)