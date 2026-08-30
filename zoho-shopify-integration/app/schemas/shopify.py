from pydantic import BaseModel, EmailStr, Field


class CustomerCreate(BaseModel):
    first_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    last_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        max_length=30,
    )


class CustomerUpdate(BaseModel):
    first_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    last_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    email: EmailStr | None = None

    phone: str | None = Field(
        default=None,
        max_length=30,
    )