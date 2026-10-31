from fastapi import APIRouter, status
from typing import List
from app.models.schemas import PlanCreate, PlanResponse

router = APIRouter()

_plans_db: List[dict] = [
    {
        "id": "PLAN-001",
        "name": "Starter Plan",
        "code": "PLAN-STR",
        "price": 49.00,
        "billing_frequency": "Monthly",
        "minimum_quantity": 1,
        "availability_period": "Always Available",
        "status": "Active",
        "subscribers_count": 420,
        "features": ["Up to 100 subscribers", "Email support", "Basic reports"]
    },
    {
        "id": "PLAN-002",
        "name": "Growth Professional",
        "code": "PLAN-PRO",
        "price": 179.00,
        "billing_frequency": "Monthly",
        "minimum_quantity": 1,
        "availability_period": "Always Available",
        "status": "Active",
        "subscribers_count": 780,
        "features": ["Up to 2,500 subscribers", "Priority support", "Cohort analytics"]
    }
]

@router.get("/", response_model=List[PlanResponse])
def get_plans():
    return _plans_db

@router.post("/", response_model=PlanResponse, status_code=status.HTTP_201_CREATED)
def create_plan(payload: PlanCreate):
    new_id = f"PLAN-{str(len(_plans_db) + 1).zfill(3)}"
    new_plan = {
        "id": new_id,
        "name": payload.name,
        "code": payload.code,
        "price": payload.price,
        "billing_frequency": payload.billing_frequency,
        "minimum_quantity": payload.minimum_quantity,
        "availability_period": payload.availability_period,
        "status": payload.status,
        "subscribers_count": 0,
        "features": payload.features
    }
    _plans_db.append(new_plan)
    return new_plan
