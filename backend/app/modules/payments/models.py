import uuid
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, DateTime, Text, Numeric, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin, utc_now


class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_reference: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    invoice_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("invoices.id", ondelete="SET NULL"), nullable=True, index=True
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), default="credit_card", nullable=False)  # credit_card, ach, wire_transfer, stripe
    payment_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, server_default=func.now(), nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), default="completed", index=True, nullable=False)  # completed, processing, failed, refunded
    gateway_transaction_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    customer: Mapped["User"] = relationship("User", back_populates="payments")
    invoice: Mapped[Optional["Invoice"]] = relationship("Invoice", back_populates="payments")
    allocations: Mapped[List["PaymentAllocation"]] = relationship(
        "PaymentAllocation", back_populates="payment", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Payment {self.payment_reference} ({self.status}) - ${self.amount}>"


class PaymentAllocation(Base):
    __tablename__ = "payment_allocations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    payment_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("payments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    invoice_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("invoices.id", ondelete="CASCADE"), nullable=False, index=True
    )
    amount_allocated: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    allocated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utc_now, server_default=func.now(), nullable=False
    )

    payment: Mapped["Payment"] = relationship("Payment", back_populates="allocations")
    invoice: Mapped["Invoice"] = relationship("Invoice", back_populates="payment_allocations")

    def __repr__(self) -> str:
        return f"<PaymentAllocation payment={self.payment_id} invoice={self.invoice_id} (${self.amount_allocated})>"
