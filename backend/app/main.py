from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assistant import router as assistant_router
from app.api.health import router as health_router
from app.api.community import router as community_router
from app.api.reports import router as reports_router
from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Importing the report router registers its model with the shared Base.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Thaai Thadam API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(health_router, prefix="/api")

app.include_router(reports_router, prefix="/api")

app.include_router(community_router, prefix="/api")

app.include_router(assistant_router, prefix="/api")
