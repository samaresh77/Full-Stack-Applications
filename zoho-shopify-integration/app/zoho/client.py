import httpx


class ZohoClient:
    def __init__(self, api_domain: str, access_token: str):
        self.api_domain = api_domain.rstrip("/")
        self.access_token = access_token

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Zoho-oauthtoken {self.access_token}",
            "Content-Type": "application/json",
        }

    async def create_contact(self, data: dict) -> dict:
        url = f"{self.api_domain}/crm/v8/Contacts"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=self.headers,
                json={
                    "data": [data],
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Zoho returned HTTP {response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def get_contact(self, contact_id: str) -> dict:
        url = f"{self.api_domain}/crm/v8/Contacts/{contact_id}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=self.headers,
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Zoho returned HTTP {response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def list_contacts(self) -> dict:
        url = f"{self.api_domain}/crm/v8/Contacts"

        params = {
            "fields": "First_Name,Last_Name,Email,Phone,Account_Name"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(
                url,
                headers=self.headers,
                params=params,
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Zoho returned HTTP {response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def update_contact(
        self,
        contact_id: str,
        data: dict,
    ) -> dict:
        url = f"{self.api_domain}/crm/v8/Contacts/{contact_id}"

        async with httpx.AsyncClient() as client:
            response = await client.put(
                url,
                headers=self.headers,
                json={
                    "data": [data],
                },
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Zoho returned HTTP {response.status_code}: "
                f"{response.text}"
            )

        return response.json()

    async def delete_contact(self, contact_id: str) -> dict:
        url = f"{self.api_domain}/crm/v8/Contacts/{contact_id}"

        async with httpx.AsyncClient() as client:
            response = await client.delete(
                url,
                headers=self.headers,
                timeout=30.0,
            )

        if response.is_error:
            raise RuntimeError(
                f"Zoho returned HTTP {response.status_code}: "
                f"{response.text}"
            )

        return response.json()