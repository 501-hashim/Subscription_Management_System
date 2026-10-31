from datetime import datetime, timedelta
from typing import Dict, Any, List

class BillingEngine:
    """
    Core automated recurring billing & MRR calculation engine.
    """

    @staticmethod
    def calculate_next_billing_date(start_date_str: str, cycle: str = "Monthly") -> str:
        """Computes the next billing date based on cadence."""
        try:
            start_dt = datetime.strptime(start_date_str, "%Y-%m-%d")
        except ValueError:
            start_dt = datetime.now()

        if cycle.lower() == "annual":
            next_dt = start_dt + timedelta(days=365)
        elif cycle.lower() == "quarterly":
            next_dt = start_dt + timedelta(days=90)
        elif cycle.lower() == "weekly":
            next_dt = start_dt + timedelta(days=7)
        else: # Monthly
            next_dt = start_dt + timedelta(days=30)
            
        return next_dt.strftime("%Y-%m-%d")

    @staticmethod
    def compute_mrr(active_subscriptions: List[Dict[str, Any]]) -> float:
        """Normalizes revenue into standard Monthly Recurring Revenue (MRR)."""
        mrr = 0.0
        for sub in active_subscriptions:
            if sub.get("status", "").lower() != "active":
                continue
            amt = float(sub.get("amount", 0.0))
            cycle = sub.get("billing_cycle", "Monthly").lower()
            if cycle == "annual":
                mrr += amt / 12.0
            elif cycle == "quarterly":
                mrr += amt / 3.0
            elif cycle == "weekly":
                mrr += amt * 4.33
            else:
                mrr += amt
        return round(mrr, 2)

billing_engine = BillingEngine()
