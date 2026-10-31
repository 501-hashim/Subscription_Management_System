from fastapi import APIRouter
from app.models.schemas import DashboardMetricsResponse, KpiMetric

router = APIRouter()

@router.get("/kpis", response_model=DashboardMetricsResponse)
def get_dashboard_kpis():
    """Retrieve top-line executive dashboard metrics."""
    return DashboardMetricsResponse(
        active_subscriptions=KpiMetric(value=1428, change="+12.4%", trend="up"),
        total_revenue_mrr=KpiMetric(value=284500.0, change="+8.2%", trend="up"),
        outstanding_payments=KpiMetric(value=18450.0, change="-4.1%", trend="down"),
        overdue_invoices=KpiMetric(value=7, change="+2", trend="alert", amount=4890.0)
    )

@router.get("/revenue-chart")
def get_revenue_chart_data():
    """Retrieve 7-month MRR and ARR growth timeline."""
    return [
        {"month": "Jan", "mrr": 18400, "arr": 220000, "new_subscriptions": 42},
        {"month": "Feb", "mrr": 19800, "arr": 238000, "new_subscriptions": 51},
        {"month": "Mar", "mrr": 21500, "arr": 258000, "new_subscriptions": 63},
        {"month": "Apr", "mrr": 22900, "arr": 275000, "new_subscriptions": 58},
        {"month": "May", "mrr": 24700, "arr": 296000, "new_subscriptions": 74},
        {"month": "Jun", "mrr": 26200, "arr": 314000, "new_subscriptions": 82},
        {"month": "Jul", "mrr": 28450, "arr": 341400, "new_subscriptions": 95},
    ]
