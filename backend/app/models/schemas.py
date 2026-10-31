from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# ---------------------------------------------------------------------------
# Customer Schemas
# ---------------------------------------------------------------------------
class CustomerBase(BaseModel):
    name: str = Field(..., example="Sarah Jenkins")
    email: EmailStr = Field(..., example="sarah.jenkins@acmecorp.com")
    company: str = Field(..., example="Acme Corporation")
    phone: Optional[str] = Field(None, example="+1 (555) 234-5678")
    status: str = Field(default="Active", example="Active")
    address: Optional[str] = Field(None, example="742 Evergreen Terrace, Springfield, OR")

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: str
    total_subscriptions: int = 0
    joined_date: str

# ---------------------------------------------------------------------------
# Product Schemas
# ---------------------------------------------------------------------------
class ProductBase(BaseModel):
    name: str = Field(..., example="Brightloop Core Suite")
    code: str = Field(..., example="BL-CORE")
    type: str = Field(default="Service / SaaS", example="Service / SaaS")
    sales_price: float = Field(..., example=199.00)
    cost_price: float = Field(default=0.0, example=45.00)
    variants: List[str] = Field(default_factory=list, example=["Monthly", "Annual"])
    status: str = Field(default="Available", example="Available")
    description: Optional[str] = Field(None, example="All-in-one recurring revenue billing platform.")

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: str

# ---------------------------------------------------------------------------
# Subscription Plan Schemas
# ---------------------------------------------------------------------------
class PlanBase(BaseModel):
    name: str = Field(..., example="Growth Professional")
    code: str = Field(..., example="PLAN-PRO")
    price: float = Field(..., example=179.00)
    billing_frequency: str = Field(default="Monthly", example="Monthly")
    minimum_quantity: int = Field(default=1, example=1)
    availability_period: str = Field(default="Always Available")
    status: str = Field(default="Active", example="Active")
    features: List[str] = Field(default_factory=list)

class PlanCreate(PlanBase):
    pass

class PlanResponse(PlanBase):
    id: str
    subscribers_count: int = 0

# ---------------------------------------------------------------------------
# Commercial Quotation Schemas
# ---------------------------------------------------------------------------
class QuotationBase(BaseModel):
    customer: str
    customer_id: str
    products: str
    total_amount: float
    validity_date: str
    status: str = Field(default="Draft", example="Draft")

class QuotationCreate(QuotationBase):
    pass

class QuotationResponse(QuotationBase):
    id: str
    created_at: str

# ---------------------------------------------------------------------------
# Subscription Lifecycle Schemas
# ---------------------------------------------------------------------------
class SubscriptionBase(BaseModel):
    customer: str
    customer_id: str
    plan: str
    start_date: str
    expiry_date: str
    billing_cycle: str = Field(default="Monthly")
    amount: float
    status: str = Field(default="Active")
    next_billing_date: str
    auto_renew: bool = True

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: str

# ---------------------------------------------------------------------------
# Invoice & Billing Schemas
# ---------------------------------------------------------------------------
class InvoiceItem(BaseModel):
    desc: str
    qty: int = 1
    unit: float
    total: float

class InvoiceBase(BaseModel):
    customer: str
    customer_id: str
    invoice_date: str
    due_date: str
    amount: float
    status: str = Field(default="Pending", example="Pending")
    payment_method: str = Field(default="Bank Wire / Card")
    items: List[InvoiceItem] = Field(default_factory=list)

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceResponse(InvoiceBase):
    id: str

# ---------------------------------------------------------------------------
# Payment Schemas
# ---------------------------------------------------------------------------
class PaymentBase(BaseModel):
    customer: str
    invoice_number: str
    payment_method: str
    amount: float
    payment_date: str
    status: str = Field(default="Completed")
    transaction_ref: Optional[str] = None

class PaymentCreate(PaymentBase):
    pass

class PaymentResponse(PaymentBase):
    id: str

# ---------------------------------------------------------------------------
# Discount & Promotion Schemas
# ---------------------------------------------------------------------------
class DiscountBase(BaseModel):
    name: str
    type: str = Field(default="Percentage")
    value: str
    applicable_products: str = "All Subscription Plans"
    start_date: str
    end_date: str
    usage_limit: int = 100
    status: str = "Active"

class DiscountCreate(DiscountBase):
    pass

class DiscountResponse(DiscountBase):
    id: str
    used_count: int = 0

# ---------------------------------------------------------------------------
# Dashboard Analytics Schemas
# ---------------------------------------------------------------------------
class KpiMetric(BaseModel):
    value: float
    change: str
    trend: str
    amount: Optional[float] = None

class DashboardMetricsResponse(BaseModel):
    active_subscriptions: KpiMetric
    total_revenue_mrr: KpiMetric
    outstanding_payments: KpiMetric
    overdue_invoices: KpiMetric
