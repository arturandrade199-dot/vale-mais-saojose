from functools import lru_cache
from typing import Any

from supabase import Client, create_client

from app.config import get_settings


@lru_cache
def get_service_client() -> Client:
    """Client autenticado com a service/secret key — ignora RLS.
    Usar apenas no backend, nunca expor ao frontend."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_secret_key)


def maybe_single_data(query) -> dict[str, Any] | None:
    """Executa uma query .maybe_single() com segurança.

    Em algumas versões do supabase-py, .execute() retorna None (em vez de
    um objeto de resposta com data=None) quando nenhuma linha é encontrada.
    """
    result = query.execute()
    return result.data if result is not None else None
