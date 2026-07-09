import stripe
from fastapi import APIRouter, Depends, HTTPException

import app.stripe_client  # noqa: F401  (configura stripe.api_key ao importar)
from app.auth import CurrentUser, get_current_user
from app.config import get_settings
from app.schemas import BillingPortalOut, CheckoutSessionOut
from app.supabase_client import get_service_client

router = APIRouter(prefix="/api", tags=["billing"])


@router.post("/checkout-session", response_model=CheckoutSessionOut)
def create_checkout_session(user: CurrentUser = Depends(get_current_user)):
    settings = get_settings()
    if not settings.stripe_price_id:
        raise HTTPException(status_code=500, detail="STRIPE_PRICE_ID não configurado no backend")

    client = get_service_client()
    profile = (
        client.table("profiles").select("*").eq("id", user.id).maybe_single().execute().data
    )
    if not profile:
        raise HTTPException(status_code=400, detail="Complete seu cadastro antes de assinar")

    session = stripe.checkout.Session.create(
        mode="subscription",
        line_items=[{"price": settings.stripe_price_id, "quantity": 1}],
        customer_email=profile["email"],
        client_reference_id=user.id,
        subscription_data={"metadata": {"user_id": user.id}},
        success_url=f"{settings.frontend_url}/perfil?checkout=sucesso",
        cancel_url=f"{settings.frontend_url}/perfil?checkout=cancelado",
    )
    return CheckoutSessionOut(url=session.url)


@router.post("/billing-portal", response_model=BillingPortalOut)
def create_billing_portal(user: CurrentUser = Depends(get_current_user)):
    settings = get_settings()
    client = get_service_client()
    sub = (
        client.table("subscriptions")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .maybe_single()
        .execute()
        .data
    )
    if not sub or not sub.get("stripe_customer_id"):
        raise HTTPException(status_code=400, detail="Nenhuma assinatura encontrada")

    session = stripe.billing_portal.Session.create(
        customer=sub["stripe_customer_id"],
        return_url=f"{settings.frontend_url}/perfil",
    )
    return BillingPortalOut(url=session.url)
