import uuid
from datetime import date
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Boolean, Date, Numeric, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin


class Subscription(Base, TimestampMixin):
    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    subscription_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    plan_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("plans.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    quotation_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("quotations.id", ondelete="SET NULL"), nullable=True, index=True
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    expiry_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    next_billing_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    billing_cycle: Mapped[str] = mapped_column(String(50), default="Monthly", nullable=False)  # Weekly, Monthly, Quarterly, Annual
    status: Mapped[str] = mapped_column(String(50), default="Active", index=True, nullable=False)  # Active, Pending, Suspended, Cancelled, Expired
    auto_renew: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    recurring_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)

    # Relationships
    customer: Mapped["User"] = relationship("User", back_populates="subscriptions")
    plan: Mapped["Plan"] = relationship("Plan", back_populates="subscriptions")
    quotation: Mapped[Optional["Quotation"]] = relationship("Quotation", back_populates="subscriptions")
    items: Mapped[List["SubscriptionItem"]] = relationship(
        "SubscriptionItem", back_populates="subscription", cascade="all, delete-orphan", lazy="selectin"
    )
    invoices: Mapped[List["Invoice"]] = relationship("Invoice", back_populates="subscription")

    def __repr__(self) -> str:
        return f"<Subscription {self.subscription_code} ({self.status}) - ${self.recurring_amount}/{self.billing_cycle}>"


class SubscriptionItem(Base):
    __tablename__ = "subscription_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    subscription_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("subscriptions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id", ondelete="RESTRICT"), nullable=False
    )
    variant_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True
    )
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    total_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)

    subscription: Mapped["Subscription"] = relationship("Subscription", back_populates="items")
    product: Mapped["Product"] = relationship("Product")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant")
