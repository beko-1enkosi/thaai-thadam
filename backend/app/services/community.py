from collections import Counter

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import Report
from app.schemas.community import CommunitySummary
from app.schemas.report import ReportRead


def get_public_reports(db: Session) -> list[ReportRead]:
    # Explicitly select safe columns. Never load free text into a public response.
    query = select(
        Report.id,
        Report.category,
        Report.area,
        Report.occurred_at,
        Report.created_at,
        Report.status,
    ).order_by(Report.created_at.desc(), Report.id.desc())
    return [ReportRead.model_validate(row) for row in db.execute(query).mappings()]


def summarize_reports(reports: list[ReportRead]) -> CommunitySummary:
    # Count the same snapshot shown in the list, including any tied categories.
    categories = Counter(report.category for report in reports)
    areas = Counter(report.area for report in reports)
    return CommunitySummary(
        total_reports=len(reports),
        by_category=[
            {"category": category, "count": count}
            for category, count in sorted(categories.items(), key=lambda item: (-item[1], item[0]))
        ],
        by_area=[
            {"area": area, "count": count}
            for area, count in sorted(areas.items(), key=lambda item: (-item[1], item[0]))
        ],
    )
