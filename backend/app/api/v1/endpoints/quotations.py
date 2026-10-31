from fastapi import APIRouter, status
from typing import List
from app.models.schemas import QuotationCreate, QuotationResponse

router = APIRouter()

_quotations_db: List[dict] = [
    {
        "id": "QT-2025-089",
        "customer": "Acme Corporation",
        "customer_id": "CUST-001",
        "products": "Growth Professional + API Gateway",
        "total_amount": 328.00,
        "validity_date": "2025-11-30",
        "status": "Accepted",
        "created_at": "2025-10-15"
    }
]

@router.get("/", response_model=List[QuotationResponse])
def get_quotations():
    return _quotations_db

@router.post("/", response_model=QuotationResponse, status_code=status.HTTP_201_CREATED)
def create_quotation(payload: QuotationCreate):
    new_id = f"QT-2025-{str(len(_quotations_db) + 90).zfill(3)}"
    new_quote = {
        "id": new_id,
        **payload.dict(),
        "created_at": "2026-10-31"
    }
    _quotations_db.insert(0, new_quote)
    return new_quote
