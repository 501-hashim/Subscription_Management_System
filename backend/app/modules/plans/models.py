import uuid
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import String, Boolean, Text, Numeric, Integer, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin


class Plan(Base, TimestampMixin):
    __tablename__ = "plans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    billing_frequency: Mapped[str] = mapped_column(String(50), default="Monthly", nullable=False)  # Weekly, Monthly, Quarterly, Annual
    price: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=Decimal("0.00"), nullable=False)
    minimum_quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    availability_period: Mapped[str] = mapped_column(String(100), default="Always Available", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    features: Mapped[Optional[List[str]]] = mapped_column(JSON, default=list, nullable=True)

    # Relationships
    plan_products: Mapped[List["PlanProduct"]] = relationship(
        "PlanProduct", back_populates="plan", cascade="all, delete-orphan", lazy="selectin"
    )
    subscriptions: Mapped[List["Subscription"]] = relationship("Subscription", back_populates="plan")

    def __repr__(self) -> str:
        return f"<Plan {self.name} ({self.billing_frequency}) - ${self.price}>"


class PlanProduct(Base):
    __tablename__ = "plan_products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    plan_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True
    )
    variant_id: Mapped[Optional[str]] = mapped_column(
        String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True
    )
    is_included: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    plan: Mapped["Plan"] = relationship("Plan", back_populates="plan_products")
    product: Mapped["Product"] = relationship("Product")
    variant: Mapped[Optional["ProductVariant"]] = relationship("ProductVariant")

    def __repr__(self) -> str:
        return f"<PlanProduct plan={self.plan_id} product={self.product_id}>"
