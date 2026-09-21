from datetime import datetime, timezone
from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator

ReportCategory = Literal[
    "poor_lighting",
    "harassment_safety",
    "unsafe_stop_hub",
    "road_walkway_obstruction",
    "transport_concern",
    "accessibility_issue",
    "other",
]
ReportArea = Literal[
    "Thillai Nagar", "Chathiram Bus Stand", "Trichy Junction",
    "Cantonment", "Rockfort", "Srirangam",
]


class ReportCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    category: ReportCategory
    area: ReportArea
    landmark: str | None = Field(default=None, max_length=160)
    description: str = Field(min_length=10, max_length=2000)
    occurred_at: AwareDatetime | None = None

    @field_validator("landmark")
    @classmethod
    def empty_landmark(cls, value):
        return value or None

    @field_validator("occurred_at")
    @classmethod
    def past_time_in_utc(cls, value):
        if value is None:
            return None
        value = value.astimezone(timezone.utc)
        if value > datetime.now(timezone.utc):
            raise ValueError("Choose a time that is not in the future.")
        return value


class ReportReceipt(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: Literal["received"]
    created_at: datetime

    @field_validator("created_at", mode="before")
    @classmethod
    def restore_created_timezone(cls, value):
        # SQLite stores naive datetime values; all stored times represent UTC.
        if isinstance(value, datetime) and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class ReportRead(ReportReceipt):
    category: ReportCategory
    area: ReportArea
    landmark: str | None
    description: str
    occurred_at: datetime | None

    @field_validator("occurred_at", mode="before")
    @classmethod
    def restore_occurred_timezone(cls, value):
        if isinstance(value, datetime) and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value
