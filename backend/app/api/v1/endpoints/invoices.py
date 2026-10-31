from fastapi import APIRouter, status
from typing import List
from app.models.schemas import InvoiceCreate, InvoiceResponse

router = APIRouter()

_invoices_db: List[dict] = [
    {
        "id": "INV-2025-1082",
        "customer": "Acme Corporation",
        "customer_id": "CUST-001",
        "invoice_date": "2025-10-15",
        "due_date": "2025-10-30",
        "amount": 328.00,
        "status": "Paid",
        "payment_method": "Credit Card (Visa ···· 4242)",
        "items": [
            {"desc": "Growth Professional Subscription", "qty": 1, "unit": 179.0, "total": 179.0},
            {"desc": "Dedicated API Gateway", "qty": 1, "unit": 149.0, "total": 149.0}
        ]
    },
    {
        "id": "INV-2025-1084",
        "customer": "NovaTech Solutions",
        "customer_id": "CUST-003",
        "invoice_date": "2025-10-01",
        "due_date": "2025-10-15",
        "amount": 5490.00,
        "status": "Overdue",
        "payment_method": "Bank Wire Transfer",
        "items": [
            {"desc": "Enterprise Scale Annual Renewal", "qty": 1, "unit": 5490.0, "total": 5490.0}
        ]
    }
]

@router.get("/", response_model=List[InvoiceResponse])
def get_invoices():
    return _invoices_db

@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(payload: InvoiceCreate):
    new_id = f"INV-2025-{str(len(_invoices_db) + 1088).zfill(4)}"
    new_inv = {
        "id": new_id,
        **payload.dict()
    }
    _invoices_db.insert(0, new_inv)
    return new_inv
