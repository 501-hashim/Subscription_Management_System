import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import String, Boolean, Date, DateTime, Numeric, Integer, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin, utc_now


class TaxRule(Base, TimestampMixin):
    __tablename__ = "tax_rules"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    tax_type: Mapped[str] = mapped_column(String(50), default="Percentage", nullable=False)  # Percentage, Fixed
    rate: Mapped[Decimal] = mapped_column(Numeric(6, 4), default=Decimal("0.0000"), nullable=False)  # e.g. 0.1000 for 10%
    country: Mapped[str] = mapped_column(String(100), default="US", nullable=False)
    state: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return f"<TaxRule {self.name} ({self.rate * 100}%)>"


class Discount(Base, TimestampMixin):
    __tablename__ = "discounts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    discount_type: Mapped[str] = mapped_column(String(50), default="Percentage", nullable=False)  # Percentage, Fixed
    value: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    usage_limit: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    used_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    usages: Mapped[list["DiscountUsage"]] = relationship("DiscountUsage", back_populates="discount")

    def __repr__(self) -> str:
        return f"<Discount {self.code} - {self.value}>"


class DiscountUsage(Base):
    __tablename__ = "discount_usage"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    discount_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("discounts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    customer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    invoice_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True, index=True
    )
    amount_discounted: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    used_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, server_default=func.now(), nullable=False
    )

    discount: Mapped["Discount"] = relationship("Discount", back_populates="usages")
    customer: Mapped["User"] = relationship("User")
    invoice: Mapped[Optional["Invoice"]] = relationship("Invoice")
