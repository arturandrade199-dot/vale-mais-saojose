from fastapi import APIRouter, Depends, HTTPException

from app.auth import CurrentUser, get_current_user
from app.schemas import CategoryOut, CompanyOut
from app.supabase_client import get_service_client, maybe_single_data

router = APIRouter(prefix="/api", tags=["companies"])


def _require_active_subscription(user_id: str) -> None:
    client = get_service_client()
    data = maybe_single_data(
        client.table("subscriptions").select("status").eq("user_id", user_id).maybe_single()
    )
    status_value = data["status"] if data else "inactive"
    if status_value != "active":
        raise HTTPException(
            status_code=403,
            detail="Assinatura inativa. Assine o Vale Mais São José para ver os parceiros.",
        )


@router.get("/categories", response_model=list[CategoryOut])
def list_categories():
    client = get_service_client()
    result = client.table("categories").select("*").order("sort_order").execute()
    return result.data or []


@router.get("/companies", response_model=list[CompanyOut])
def list_companies(
    category: str | None = None,
    search: str | None = None,
    user: CurrentUser = Depends(get_current_user),
):
    _require_active_subscription(user.id)

    client = get_service_client()
    query = (
        client.table("partner_companies")
        .select("*, categories(slug, name)")
        .eq("active", True)
    )
    if search:
        query = query.ilike("name", f"%{search}%")
    result = query.order("name").execute()

    rows = result.data or []
    companies = []
    for row in rows:
        cat = row.get("categories") or {}
        if category and cat.get("slug") != category:
            continue
        companies.append(
            CompanyOut(
                id=row["id"],
                name=row["name"],
                category_slug=cat.get("slug", ""),
                category_name=cat.get("name", ""),
                logo_url=row.get("logo_url"),
                discount_type=row["discount_type"],
                discount_value=row["discount_value"],
                min_purchase_value=row.get("min_purchase_value"),
                description=row["description"],
                neighborhood=row.get("neighborhood"),
                city=row.get("city"),
            )
        )
    return companies
