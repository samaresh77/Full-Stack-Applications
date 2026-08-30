from app.schemas.lead import LeadCreate
from app.zoho.client import ZohoClient


class LeadService:
    def __init__(self, client: ZohoClient):
        self.client = client

    async def create_lead(
        self,
        lead: LeadCreate,
    ) -> dict:
        data = {
            "First_Name": lead.first_name,
            "Last_Name": lead.last_name,
            "Email": str(lead.email),
            "Company": lead.company,
        }

        if lead.phone:
            data["Phone"] = lead.phone

        if lead.lead_source:
            data["Lead_Source"] = lead.lead_source

        return await self.client.create_lead(data)

    async def list_leads(self) -> dict:
        return await self.client.list_leads()

    async def get_lead(
        self,
        lead_id: str,
    ) -> dict:
        return await self.client.get_lead(lead_id)