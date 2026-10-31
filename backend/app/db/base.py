# Import all models here so that Alembic and SQLAlchemy can discover them through Base.metadata
from app.db.base_class import Base

from app.modules.auth.models import (
    User,
    Role,
    user_roles,
    EmailVerificationToken,
    PasswordResetToken,
)
from app.modules.organization.models import OrganizationMember
from app.modules.products.models import Product, ProductVariant
from app.modules.plans.models import Plan, PlanProduct
from app.modules.quotations.models import QuotationTemplate, Quotation, QuotationItem
from app.modules.subscriptions.models import Subscription, SubscriptionItem
from app.modules.billing.models import Invoice, InvoiceItem
from app.modules.tax_discounts.models import TaxRule, Discount, DiscountUsage
from app.modules.payments.models import Payment, PaymentAllocation

__all__ = [
    "Base",
    "User",
    "Role",
    "user_roles",
    "EmailVerificationToken",
    "PasswordResetToken",
    "OrganizationMember",
    "Product",
    "ProductVariant",
    "Plan",
    "PlanProduct",
    "QuotationTemplate",
    "Quotation",
    "QuotationItem",
    "Subscription",
    "SubscriptionItem",
    "Invoice",
    "InvoiceItem",
    "TaxRule",
    "Discount",
    "DiscountUsage",
    "Payment",
    "PaymentAllocation",
]
