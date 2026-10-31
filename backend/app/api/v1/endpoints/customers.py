from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models.schemas import CustomerCreate, CustomerResponse

router = APIRouter()

# In-memory storage mock
_customers_db: List[dict] = [
    {
        "id": "CUST-001",
        "name": "Sarah Jenkins",
        "email": "sarah.jenkins@acmecorp.com",
        "company": "Acme Corporation",
        "phone": "+1 (555) 234-5678",
        "total_subscriptions": 3,
        "status": "Active",
        "joined_date": "2025-03-15",
        "address": "742 Evergreen Terrace, Springfield, OR"
    },
    {
        "id": "CUST-002",
        "name": "David Chen",
        "email": "d.chen@apexlogistics.io",
        "company": "Apex Global Logistics",
        "phone": "+1 (555) 345-6789",
        "total_subscriptions": 1,
        "status": "Active",
        "joined_date": "2025-06-20",
        "address": "100 Market St, Suite 400, San Francisco, CA"
    }
]

@router.get("/", response_model=List[CustomerResponse])
def get_customers():
    """Retrieve all customer accounts."""
    return _customers_db

@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(payload: CustomerCreate):
    """Register a new customer account."""
    new_id = f"CUST-{str(len(_customers_db) + 1).zfill(3)}"
    new_cust = {
        "id": new_id,
        "name": payload.name,
        "email": payload.email,
        "company": payload.company,
        "phone": payload.phone,
        "status": payload.status,
        "address": payload.address,
        "total_subscriptions": 0,
        "joined_date": "2026-10-31"
    }
    _customers_db.insert(0, new_cust)
    return new_cust
