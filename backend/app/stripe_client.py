import stripe

from app.config import get_settings

stripe.api_key = get_settings().stripe_secret_key
