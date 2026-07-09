from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import billing, companies, profile, webhooks

settings = get_settings()

app = FastAPI(title="Vale Mais São José API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router)
app.include_router(companies.router)
app.include_router(billing.router)
app.include_router(webhooks.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
