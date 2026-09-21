from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def health():
    return HealthResponse(status="ok", message="Thaai Thadam API is running")
