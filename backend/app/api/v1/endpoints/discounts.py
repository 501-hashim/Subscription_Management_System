from fastapi import APIRouter, status
from typing import List
from app.models.schemas import DiscountCreate, DiscountResponse

router = APIRouter()

_discounts_db: List[dict] = [
    {
        "id": "DISC-001",
        "name": "EARLYBIRD20",
        "type": "Percentage",
        "value": "20%",
        "applicable_products": "All Subscription Plans",
        "start_date": "2025-01-01",
        "end_date": "2025-12-31",
        "usage_limit": 500,
        "used_count": 218,
        "status": "Active"
    }
]

@router.get("/", response_model=List[DiscountResponse])
def get_discounts():
    return _discounts_db

@router.post("/", response_model=DiscountResponse, status_code=status.HTTP_201_CREATED)
def create_discount(payload: DiscountCreate):
    new_id = f"DISC-{str(len(_discounts_db) + 1).zfill(3)}"
    new_disc = {
        "id": new_id,
        **payload.dict(),
        "used_count": 0
    }
    _discounts_db.append(new_disc)
    return new_disc
