from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import token, agent

app = FastAPI(
    title="YAMI AI Backend",
    description="FastAPI backend for YAMI — Voice-Interactive Thesis Consultant powered by Agora Conversational AI.",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
# Allow the Next.js frontend origin
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(token.router)
app.include_router(agent.router)


@app.get("/health", tags=["Health"])
def health_check():
    """Liveness probe — returns OK when the server is running."""
    return {"status": "ok", "app": "YAMI AI Backend"}
