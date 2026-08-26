from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field

class TicketStatus(str, Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    CLOSED = "Closed"

    
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class TicketCreate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200
    )
    description: str = Field(
        min_length=5
    )


class TicketUpdate(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=200
    )
    description: str = Field(
        min_length=5
    )

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    created_by: int
    assigned_to: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserSummary(BaseModel):
    id: int
    username: str


class AdminTicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    created_by: UserSummary
    assigned_to: UserSummary | None
    created_at: datetime
    updated_at: datetime

class TicketStatusUpdate(BaseModel):
    status: TicketStatus

class TicketAssignment(BaseModel):
    support_user_id: int

class DashboardStats(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    closed_tickets: int
