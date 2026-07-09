"""Sincroniza manualmente o status da assinatura de um usuário, consultando o Stripe
diretamente pela API (sem depender de webhook) — útil para testes locais sem o Stripe CLI.

Uso:
    cd backend
    python scripts/sync_subscription.py usuario@exemplo.com
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import stripe  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.supabase_client import get_service_client, maybe_single_data  # noqa: E402

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


def main() -> None:
    if len(sys.argv) != 2:
        print("Uso: python scripts/sync_subscription.py usuario@exemplo.com")
        sys.exit(1)

    email = sys.argv[1]
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key

    client = get_service_client()
    profile = maybe_single_data(
        client.table("profiles").select("id, email").eq("email", email).maybe_single()
    )
    if not profile:
        print(f"Nenhum perfil encontrado no Supabase com o e-mail {email}. Complete o cadastro no app primeiro.")
        sys.exit(1)

    customers = stripe.Customer.list(email=email, limit=1)
    if not customers.data:
        print(f"Nenhum customer do Stripe encontrado com o e-mail {email}. Finalize o checkout primeiro.")
        sys.exit(1)
    customer = customers.data[0]

    subscriptions = stripe.Subscription.list(customer=customer.id, status="all", limit=1)
    if not subscriptions.data:
        print("Nenhuma assinatura encontrada para esse cliente no Stripe.")
        sys.exit(1)
    subscription = subscriptions.data[0]

    status = _STRIPE_STATUS_MAP.get(subscription.status, "inactive")
    row = {
        "user_id": profile["id"],
        "stripe_customer_id": customer.id,
        "stripe_subscription_id": subscription.id,
        "status": status,
    }
    client.table("subscriptions").upsert(row, on_conflict="user_id").execute()

    print(f"OK: assinatura de {email} sincronizada como '{status}' (stripe status: {subscription.status}).")


if __name__ == "__main__":
    main()
