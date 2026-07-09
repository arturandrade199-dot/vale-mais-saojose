from datetime import datetime, timezone

import stripe
from fastapi import APIRouter, HTTPException, Request

import app.stripe_client  # noqa: F401
from app.config import get_settings
from app.supabase_client import get_service_client

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

_STRIPE_STATUS_MAP = {
    "active": "active",
    "trialing": "active",
    "past_due": "past_due",
    "unpaid": "past_due",
    "canceled": "canceled",
    "incomplete": "inactive",
    "incomplete_expired": "inactive",
    "paused": "inactive",
}


def _upsert_subscription(
    user_id: str,
    stripe_customer_id: str | None,
    stripe_subscription_id: str | None,
    status: str,
    current_period_end: int | None,
) -> None:
    client = get_service_client()
    row = {
        "user_id": user_id,
        "stripe_customer_id": stripe_customer_id,
        "stripe_subscription_id": stripe_subscription_id,
        "status": status,
    }
    if current_period_end:
        row["current_period_end"] = datetime.fromtimestamp(
            current_period_end, tz=timezone.utc
        ).isoformat()
    client.table("subscriptions").upsert(row, on_conflict="user_id").execute()


@router.post("/stripe")
async def stripe_webhook(request: Request):
    settings = get_settings()
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=500, detail="STRIPE_WEBHOOK_SECRET não configurado")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except (ValueError, stripe.error.SignatureVerificationError) as exc:
        raise HTTPException(status_code=400, detail=f"Webhook inválido: {exc}") from exc

    event_type = event["type"]
    data = event["data"]["object"]

    if event_type == "checkout.session.completed":
        user_id = data.get("client_reference_id")
        customer_id = data.get("customer")
        subscription_id = data.get("subscription")
        if user_id and subscription_id:
            sub = stripe.Subscription.retrieve(subscription_id)
            _upsert_subscription(
                user_id=user_id,
                stripe_customer_id=customer_id,
                stripe_subscription_id=subscription_id,
                status=_STRIPE_STATUS_MAP.get(sub["status"], "inactive"),
                current_period_end=sub.get("current_period_end"),
            )

    elif event_type in ("customer.subscription.updated", "customer.subscription.deleted"):
        user_id = (data.get("metadata") or {}).get("user_id")
        if user_id:
            mapped_status = (
                "canceled"
                if event_type == "customer.subscription.deleted"
                else _STRIPE_STATUS_MAP.get(data["status"], "inactive")
            )
            _upsert_subscription(
                user_id=user_id,
                stripe_customer_id=data.get("customer"),
                stripe_subscription_id=data.get("id"),
                status=mapped_status,
                current_period_end=data.get("current_period_end"),
            )

    return {"received": True}
