from functools import lru_cache

from supabase import Client, create_client

from app.config import get_settings


@lru_cache
def get_service_client() -> Client:
    """Client autenticado com a service/secret key — ignora RLS.
    Usar apenas no backend, nunca expor ao frontend."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_secret_key)
