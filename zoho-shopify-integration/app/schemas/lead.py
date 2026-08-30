from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=30)
    company: str = Field(..., min_length=1, max_length=200)
    lead_source: str | None = Field(default=None, max_length=100)


class LeadUpdate(BaseModel):
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=30)
    company: str | None = Field(default=None, max_length=200)
    lead_source: str | None = Field(default=None, max_length=100)