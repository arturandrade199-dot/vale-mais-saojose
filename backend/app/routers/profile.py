from fastapi import APIRouter, Depends, HTTPException

from app.auth import CurrentUser, get_current_user
from app.schemas import ProfileIn, ProfileOut, SubscriptionOut
from app.supabase_client import get_service_client, maybe_single_data

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=ProfileOut)
def get_profile(user: CurrentUser = Depends(get_current_user)):
    client = get_service_client()
    data = maybe_single_data(
        client.table("profiles").select("*").eq("id", user.id).maybe_single()
    )
    if not data:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    return data


@router.post("", response_model=ProfileOut)
def upsert_profile(payload: ProfileIn, user: CurrentUser = Depends(get_current_user)):
    client = get_service_client()
    row = {"id": user.id, **payload.model_dump()}
    result = client.table("profiles").upsert(row).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Não foi possível salvar o perfil")
    return result.data[0]


@router.get("/subscription", response_model=SubscriptionOut)
def get_subscription(user: CurrentUser = Depends(get_current_user)):
    client = get_service_client()
    data = maybe_single_data(
        client.table("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .maybe_single()
    )
    if not data:
        return SubscriptionOut(status="inactive", current_period_end=None)
    return SubscriptionOut(
        status=data["status"],
        current_period_end=data.get("current_period_end"),
    )
