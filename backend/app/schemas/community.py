from pydantic import BaseModel, Field

from app.schemas.report import ReportArea, ReportCategory, ReportRead


class CategoryCount(BaseModel):
    category: ReportCategory
    count: int = Field(ge=0)


class AreaCount(BaseModel):
    area: ReportArea
    count: int = Field(ge=0)


class CommunitySummary(BaseModel):
    total_reports: int = Field(ge=0)
    by_category: list[CategoryCount]
    by_area: list[AreaCount]


class CommunityResponse(BaseModel):
    reports: list[ReportRead]
    summary: CommunitySummary
