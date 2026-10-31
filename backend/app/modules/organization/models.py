import uuid
from typing import Optional, Dict, Any
from sqlalchemy import String, Boolean, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base, TimestampMixin


class OrganizationMember(Base, TimestampMixin):
    """
    Internal Brightloop staff and administrator member profile.
    Represents Brightloop as a single company (non-multi-tenant).
    Customers remain standard User accounts without an organization_members record.
    """
    __tablename__ = "organization_members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    department: Mapped[str] = mapped_column(String(100), default="Operations", nullable=False)
    job_title: Mapped[str] = mapped_column(String(150), default="Staff Member", nullable=False)
    is_lead: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    permissions: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        default=lambda: {
            "can_manage_customers": True,
            "can_manage_products": False,
            "can_manage_invoices": False,
            "can_manage_settings": False,
        },
        nullable=True,
    )

    # Relationship to user
    user: Mapped["User"] = relationship("User", back_populates="organization_member")

    def __repr__(self) -> str:
        return f"<OrganizationMember {self.job_title} ({self.department})>"
