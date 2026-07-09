"""Cria (uma única vez) o Product + Price da assinatura Vale Mais São José no Stripe.

Uso:
    cd backend
    python scripts/create_stripe_price.py

Imprime o price_id gerado — copie para STRIPE_PRICE_ID no backend/.env.
Idempotente: se já existir um Product "Vale Mais São José - Assinatura Mensal"
com um Price ativo de R$29,99/mês, reaproveita em vez de duplicar.
"""

import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import stripe  # noqa: E402

from app.config import get_settings  # noqa: E402

PRODUCT_NAME = "Vale Mais São José - Assinatura Mensal"
PRICE_CENTS = 2999
CURRENCY = "brl"


def main() -> None:
    settings = get_settings()
    stripe.api_key = settings.stripe_secret_key

    products = stripe.Product.list(active=True, limit=100)
    product = next((p for p in products.auto_paging_iter() if p.name == PRODUCT_NAME), None)
    if product is None:
        product = stripe.Product.create(name=PRODUCT_NAME, description="Acesso mensal aos descontos dos parceiros Vale Mais São José")
        print(f"Product criado: {product.id}")
    else:
        print(f"Product existente reaproveitado: {product.id}")

    prices = stripe.Price.list(product=product.id, active=True, limit=100)
    price = next(
        (
            p
            for p in prices.auto_paging_iter()
            if p.unit_amount == PRICE_CENTS
            and p.currency == CURRENCY
            and p.recurring
            and p.recurring.interval == "month"
        ),
        None,
    )
    if price is None:
        price = stripe.Price.create(
            product=product.id,
            unit_amount=PRICE_CENTS,
            currency=CURRENCY,
            recurring={"interval": "month"},
        )
        print(f"Price criado: {price.id}")
    else:
        print(f"Price existente reaproveitado: {price.id}")

    print("\nSTRIPE_PRICE_ID=" + price.id)


if __name__ == "__main__":
    main()
