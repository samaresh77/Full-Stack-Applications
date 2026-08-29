from pydantic import BaseModel, EmailStr
from typing import Optional

class CustomerCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None

class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class OrderResponse(BaseModel):
    order_id: int
    customer: Optional[dict]
    total_price: str
    currency: str
    order_status: str
    created_at: str