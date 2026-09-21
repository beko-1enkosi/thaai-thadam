import unittest
from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.database import Base
from app.models.report import Report
from app.services.community import get_public_reports, summarize_reports


class CommunityTests(unittest.TestCase):
    def setUp(self):
        # Isolated SQLite database. These tests never touch local user reports.
        self.engine = create_engine("sqlite://")
        Base.metadata.create_all(self.engine)
        self.db = Session(self.engine)

    def tearDown(self):
        self.db.close()
        self.engine.dispose()

    def add_report(self, category, area, created_at):
        report = Report(
            category=category, area=area,
            landmark="PRIVATE_LANDMARK_MARKER",
            description="PRIVATE_DESCRIPTION_MARKER",
            created_at=created_at,
        )
        self.db.add(report)
        self.db.commit()
        return report.id

    def test_empty_community(self):
        reports = get_public_reports(self.db)
        self.assertEqual(reports, [])
        self.assertEqual(summarize_reports(reports).model_dump(), {
            "total_reports": 0, "by_category": [], "by_area": [],
        })

    def test_public_projection_excludes_free_text(self):
        self.add_report("poor_lighting", "Thillai Nagar", datetime(2026, 1, 1))
        report = get_public_reports(self.db)[0]
        self.assertEqual(set(report.model_dump()), {
            "id", "category", "area", "occurred_at", "created_at", "status",
        })
        self.assertNotIn("PRIVATE_", report.model_dump_json())
        self.assertIsNotNone(report.created_at.tzinfo)
        self.assertIsNone(report.occurred_at)

    def test_order_and_summary_use_the_same_reports(self):
        first = self.add_report("poor_lighting", "Thillai Nagar", datetime(2026, 1, 1))
        second = self.add_report("accessibility_issue", "Rockfort", datetime(2026, 1, 2))
        third = self.add_report("poor_lighting", "Rockfort", datetime(2026, 1, 2))
        reports = get_public_reports(self.db)
        self.assertEqual([report.id for report in reports], [third, second, first])
        summary = summarize_reports(reports)
        self.assertEqual(summary.total_reports, 3)
        self.assertEqual([(item.category, item.count) for item in summary.by_category], [
            ("poor_lighting", 2), ("accessibility_issue", 1),
        ])
        self.assertEqual([(item.area, item.count) for item in summary.by_area], [
            ("Rockfort", 2), ("Thillai Nagar", 1),
        ])


if __name__ == "__main__":
    unittest.main()
