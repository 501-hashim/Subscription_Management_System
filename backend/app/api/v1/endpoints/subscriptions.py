from fastapi import APIRouter, status
from typing import List
from app.models.schemas import SubscriptionCreate, SubscriptionResponse

router = APIRouter()

_subscriptions_db: List[dict] = [
    {
        "id": "SUB-8401",
        "customer": "Acme Corporation",
        "customer_id": "CUST-001",
        "plan": "Growth Professional",
        "start_date": "2025-03-15",
        "expiry_date": "2026-03-15",
        "billing_cycle": "Monthly",
        "amount": 179.00,
        "status": "Active",
        "next_billing_date": "2025-11-15",
        "auto_renew": True
    }
]

@router.get("/", response_model=List[SubscriptionResponse])
def get_subscriptions():
    return _subscriptions_db

@router.post("/", response_model=SubscriptionResponse, status_code=status.HTTP_201_CREATED)
def create_subscription(payload: SubscriptionCreate):
    new_id = f"SUB-{str(len(_subscriptions_db) + 8402)}"
    new_sub = {
        "id": new_id,
        **payload.dict()
    }
    _subscriptions_db.insert(0, new_sub)
    return new_sub
