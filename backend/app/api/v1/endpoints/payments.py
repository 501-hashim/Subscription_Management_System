from fastapi import APIRouter, status
from typing import List
from app.models.schemas import PaymentCreate, PaymentResponse

router = APIRouter()

_payments_db: List[dict] = [
    {
        "id": "PAY-7710",
        "customer": "Acme Corporation",
        "invoice_number": "INV-2025-1082",
        "payment_method": "Credit Card (Visa)",
        "amount": 328.00,
        "payment_date": "2025-10-16 14:22",
        "status": "Completed",
        "transaction_ref": "tx_live_948a8c1f92e"
    }
]

@router.get("/", response_model=List[PaymentResponse])
def get_payments():
    return _payments_db

@router.post("/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
def record_payment(payload: PaymentCreate):
    new_id = f"PAY-{str(len(_payments_db) + 7715)}"
    new_pay = {
        "id": new_id,
        **payload.dict()
    }
    _payments_db.insert(0, new_pay)
    return new_pay
