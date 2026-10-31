from fastapi import APIRouter
from app.api.v1.endpoints import (
    dashboard,
    customers,
    products,
    plans,
    quotations,
    subscriptions,
    invoices,
    payments,
    discounts,
    reports,
    auth
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["SQL Authentication & Database"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard & KPIs"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(products.router, prefix="/products", tags=["Products & Catalog"])
api_router.include_router(plans.router, prefix="/plans", tags=["Subscription Plans"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["Commercial Quotations"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["Active Subscriptions"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["Invoices & Billing"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments & Settlements"])
api_router.include_router(discounts.router, prefix="/discounts", tags=["Promotions & Discounts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Analytics"])
