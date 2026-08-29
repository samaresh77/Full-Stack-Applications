from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..dependencies import get_current_user, require_admin
from ..database import get_db
from ..models import User
from ..schemas import (
    LoginRequest,
    TokenResponse,
    RegisterRequest,
)
from ..utils.auth import create_access_token
from ..utils.security import (
    verify_password,
    hash_password,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# LOGIN
# =========================================================

@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.username == login_data.username
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED
)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # Check whether username already exists

    existing_user = (
        db.query(User)
        .filter(
            User.username == register_data.username
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )


    # Create Support user

    user = User(
        username=register_data.username,
        password_hash=hash_password(
            register_data.password
        ),
        role="support"
    )


    db.add(user)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    db.refresh(user)


    return {
        "message": "Account created successfully",
        "id": user.id,
        "username": user.username,
        "role": user.role
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "role": current_user.role
    }


# =========================================================
# ADMIN TEST
# =========================================================

@router.get("/admin-test")
def admin_test(
    current_user: User = Depends(require_admin)
):
    return {
        "message": "You have admin access",
        "username": current_user.username,
        "role": current_user.role
    }