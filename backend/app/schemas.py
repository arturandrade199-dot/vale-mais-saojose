from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Sexo = Literal["masculino", "feminino", "outro", "prefiro_nao_dizer"]


class ProfileIn(BaseModel):
    full_name: str = Field(min_length=2)
    email: EmailStr
    phone: str | None = None
    age: int | None = Field(default=None, ge=0, le=120)
    sex: Sexo | None = None
    neighborhood: str | None = None
    city: str | None = None
    street: str | None = None


class ProfileOut(ProfileIn):
    id: str


class SubscriptionOut(BaseModel):
    status: str
    current_period_end: str | None = None


class CategoryOut(BaseModel):
    id: str
    slug: str
    name: str


class CompanyOut(BaseModel):
    id: str
    name: str
    category_slug: str
    category_name: str
    logo_url: str | None = None
    discount_type: str
    discount_value: float
    min_purchase_value: float | None = None
    description: str
    neighborhood: str | None = None
    city: str | None = None


class CheckoutSessionOut(BaseModel):
    url: str


class BillingPortalOut(BaseModel):
    url: str
