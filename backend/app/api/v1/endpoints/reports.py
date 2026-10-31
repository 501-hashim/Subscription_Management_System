from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
def get_reports_summary():
    """Retrieve financial performance and delinquent receivables breakdown."""
    return {
        "gross_invoiced": 8284.0,
        "total_settled": 556.0,
        "recovery_rate_pct": 6.7,
        "pending_amount": 1790.0,
        "overdue_past_due": 5588.0,
        "plan_revenue_distribution": [
            {"name": "Starter", "count": 420, "revenue": 20580},
            {"name": "Growth Monthly", "count": 780, "revenue": 139620},
            {"name": "Growth Annual", "count": 195, "revenue": 29087},
            {"name": "Enterprise", "count": 33, "revenue": 16467}
        ]
    }
