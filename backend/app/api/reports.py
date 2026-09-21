from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportRead, ReportReceipt
from app.services.community import get_public_reports

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("", response_model=ReportReceipt, status_code=201)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)):
    report = Report(**payload.model_dump())
    try:
        db.add(report)
        db.commit()
        db.refresh(report)
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=503, detail="Report storage is temporarily unavailable.") from None
    return report


@router.get("", response_model=list[ReportRead])
def list_reports(db: Session = Depends(get_db)):
    try:
        return get_public_reports(db)
    except SQLAlchemyError:
        raise HTTPException(status_code=503, detail="Reports are temporarily unavailable.") from None
