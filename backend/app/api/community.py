from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.community import CommunityResponse
from app.services.community import get_public_reports, summarize_reports

router = APIRouter(prefix="/community", tags=["Community"])


@router.get("/reports", response_model=CommunityResponse)
def community_reports(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "no-store"
    try:
        reports = get_public_reports(db)
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Community updates are temporarily unavailable.") from None
    return CommunityResponse(reports=reports, summary=summarize_reports(reports))
