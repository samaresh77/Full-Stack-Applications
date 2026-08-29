from pydantic import BaseModel, EmailStr
from typing import Optional

class ContactCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None

class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None

class LeadCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    company: str
    lead_source: Optional[str] = "Web"