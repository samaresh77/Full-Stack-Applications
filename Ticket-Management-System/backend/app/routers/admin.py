from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import require_admin
from ..models import Ticket, User
from ..schemas import (
    AdminTicketResponse,
    DashboardStats,
    TicketAssignment,
    TicketResponse,
    TicketStatusUpdate
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get(
    "/tickets",
    response_model=list[TicketResponse]
)
def get_all_tickets(
    search: str | None = None,
    status: str | None = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    if search:
        search_pattern = f"%{search}%"

        query = (
            query
            .join(
                User,
                Ticket.created_by == User.id
            )
            .filter(
                Ticket.title.ilike(search_pattern)
                | User.username.ilike(search_pattern)
            )
        )

    if status:
        query = query.filter(
            Ticket.status == status
        )

    tickets = (
        query
        .order_by(Ticket.created_at.desc())
        .all()
    )

    return tickets

@router.get(
    "/tickets/{ticket_id}",
    response_model=AdminTicketResponse
)
def get_admin_ticket(
    ticket_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    return {
        "id": ticket.id,
        "title": ticket.title,
        "description": ticket.description,
        "status": ticket.status,
        "created_by": {
            "id": ticket.creator.id,
            "username": ticket.creator.username
        },
        "assigned_to": (
            {
                "id": ticket.assignee.id,
                "username": ticket.assignee.username
            }
            if ticket.assignee
            else None
        ),
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at
    }

@router.patch(
    "/tickets/{ticket_id}/status",
    response_model=TicketResponse
)
def update_ticket_status(
    ticket_id: int,
    status_data: TicketStatusUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    new_status = status_data.status.value

    valid_transitions = {
        "Open": ["In Progress"],
        "In Progress": ["Closed"],
        "Closed": []
    }

    if new_status not in valid_transitions[ticket.status]:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid status transition: "
                f"{ticket.status} -> {new_status}"
            )
        )

    ticket.status = new_status

    db.commit()
    db.refresh(ticket)

    return ticket

@router.patch(
    "/tickets/{ticket_id}/assign",
    response_model=TicketResponse
)
def assign_ticket(
    ticket_id: int,
    assignment: TicketAssignment,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    support_user = (
        db.query(User)
        .filter(
            User.id == assignment.support_user_id,
            User.role == "support"
        )
        .first()
    )

    if not support_user:
        raise HTTPException(
            status_code=404,
            detail="Support user not found"
        )

    ticket.assigned_to = support_user.id

    db.commit()
    db.refresh(ticket)

    return ticket

@router.delete(
    "/tickets/{ticket_id}",
    status_code=204
)
def delete_admin_ticket(
    ticket_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()

    return None

@router.get(
    "/dashboard",
    response_model=DashboardStats
)
def get_dashboard_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_tickets = (
        db.query(func.count(Ticket.id))
        .scalar()
    )

    open_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == "Open")
        .scalar()
    )

    in_progress_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == "In Progress")
        .scalar()
    )

    closed_tickets = (
        db.query(func.count(Ticket.id))
        .filter(Ticket.status == "Closed")
        .scalar()
    )

    return {
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "in_progress_tickets": in_progress_tickets,
        "closed_tickets": closed_tickets
    }

@router.get("/support-users")
def get_support_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = (
        db.query(User)
        .filter(User.role == "support")
        .order_by(User.username)
        .all()
    )

    return [
        {
            "id": user.id,
            "username": user.username
        }
        for user in users
    ]