import uuid
from datetime import date
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Date, Text, Numeric, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin


class QuotationTemplate(Base, TimestampMixin):
    __tablename__ = "quotation_templates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    terms_and_conditions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    default_validity_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)

    quotations: Mapped[List["Quotation"]] = relationship("Quotation", back_populates="template")


class Quotation(Base, TimestampMixin):
    __tablename__ = "quotations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quotation_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    customer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    template_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("quotation_templates.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[str] = mapped_column(String(50), default="Draft", index=True, nullable=False)  # Draft, Sent, Accepted, Rejected, Expired
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    validity_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    customer: Mapped["User"] = relationship("User", back_populates="quotations")
    template: Mapped[Optional["QuotationTemplate"]] = relationship("QuotationTemplate", back_populates="quotations")
    items: Mapped[List["QuotationItem"]] = relationship(
        "QuotationItem", back_populates="quotation", cascade="all, delete-orphan", lazy="selectin"
    )
    subscriptions: Mapped[List["Subscription"]] = relationship("Subscription", back_populates="quotation")

    def __repr__(self) -> str:
        return f"<Quotation {self.quotation_number} - {self.status} (${self.total_amount})>"


class QuotationItem(Base):
    __tablename__ = "quotation_items"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quotation_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("quotations.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("products.id", ondelete="SET NULL"), nullable=True
    )
    variant_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True
    )
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    total_amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)

    quotation: Mapped["Quotation"] = relationship("Quotation", back_populates="items")
    product: Mapped[Optional["Product"]] = relationship("Product")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant")
