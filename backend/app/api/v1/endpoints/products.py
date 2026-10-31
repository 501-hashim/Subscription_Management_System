from fastapi import APIRouter, status
from typing import List
from app.models.schemas import ProductCreate, ProductResponse

router = APIRouter()

_products_db: List[dict] = [
    {
        "id": "PROD-001",
        "name": "Brightloop Core Suite",
        "code": "BL-CORE",
        "type": "Service / SaaS",
        "sales_price": 199.00,
        "cost_price": 45.00,
        "variants": ["Monthly", "Annual", "Enterprise"],
        "status": "Available",
        "description": "All-in-one recurring revenue billing platform."
    },
    {
        "id": "PROD-002",
        "name": "Dedicated API Gateway & Webhooks",
        "code": "BL-GATE",
        "type": "Infrastructure",
        "sales_price": 149.00,
        "cost_price": 35.00,
        "variants": ["100k req/mo", "1M req/mo"],
        "status": "Available",
        "description": "High throughput dedicated webhook delivery endpoints."
    }
]

@router.get("/", response_model=List[ProductResponse])
def get_products():
    return _products_db

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate):
    new_id = f"PROD-{str(len(_products_db) + 1).zfill(3)}"
    new_prod = {
        "id": new_id,
        **payload.dict()
    }
    _products_db.append(new_prod)
    return new_prod
