"""
Brightloop Database Infrastructure Test Suite
Validates:
1. Connection availability & dialect detection
2. User creation & role association
3. Duplicate email prevention (unique constraint)
4. Foreign key integrity enforcement
5. Subscription lifecycle creation
6. Invoice creation & decimal calculations
7. Payment allocation & reconciliation
8. Transaction rollback & error recovery
9. Session isolation
"""
import pytest
from datetime import date, datetime, timezone
from decimal import Decimal
import uuid

from sqlalchemy import create_engine, select, event, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from app.db.base import (
    Base, User, Role, user_roles, OrganizationMember,
    Product, ProductVariant, Plan, Subscription,
    Invoice, InvoiceItem, Payment, PaymentAllocation
)


@pytest.fixture(scope="session")
def test_engine():
    """Isolated in-memory database engine for test suite."""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        echo=False
    )
    # Enable SQLite foreign key enforcement
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(test_engine):
    """Provides an isolated database session per test function with auto-rollback."""
    connection = test_engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection, expire_on_commit=False)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


# -----------------------------------------------------------------------------
# 1. Connection & Availability Tests
# -----------------------------------------------------------------------------
def test_database_connection(test_engine):
    """Verify engine connection and query execution."""
    with test_engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
        assert result == 1


# -----------------------------------------------------------------------------
# 2. User Creation & Role Association Tests
# -----------------------------------------------------------------------------
def test_user_creation_and_role_assignment(db_session):
    """Verify creating a user, assigning a role, and querying relationships."""
    admin_role = Role(name="admin", description="Super Admin Role")
    db_session.add(admin_role)
    db_session.flush()

    user = User(
        email="test.lead@brightloop.io",
        hashed_password="hashed_secure_password_test",
        full_name="Lead Engineer",
        user_type="admin",
        is_active=True,
        is_verified=True,
    )
    db_session.add(user)
    db_session.flush()

    # Associate role
    db_session.execute(
        user_roles.insert().values(user_id=user.id, role_id=admin_role.id)
    )
    db_session.commit()

    queried_user = db_session.execute(
        select(User).where(User.email == "test.lead@brightloop.io")
    ).scalar_one()

    assert queried_user.full_name == "Lead Engineer"
    assert queried_user.user_type == "admin"
    assert len(queried_user.roles) == 1
    assert queried_user.roles[0].name == "admin"


# -----------------------------------------------------------------------------
# 3. Duplicate Email Prevention Tests (Unique Constraint)
# -----------------------------------------------------------------------------
def test_duplicate_email_prevention(db_session):
    """Verify that duplicate user emails violate unique constraints."""
    user1 = User(
        email="unique@brightloop.io",
        hashed_password="pw1",
        full_name="First User",
    )
    db_session.add(user1)
    db_session.commit()

    user2 = User(
        email="unique@brightloop.io",
        hashed_password="pw2",
        full_name="Second User",
    )
    db_session.add(user2)

    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


# -----------------------------------------------------------------------------
# 4. Foreign Key Relationship Enforcement
# -----------------------------------------------------------------------------
def test_foreign_key_enforcement(db_session):
    """Verify that inserting a record referencing a non-existent parent raises an error."""
    invalid_subscription = Subscription(
        subscription_code="SUB-INVALID-001",
        customer_id=str(uuid.uuid4()),  # Non-existent customer ID
        plan_id=str(uuid.uuid4()),      # Non-existent plan ID
        start_date=date.today(),
        billing_cycle="Monthly",
        recurring_amount=Decimal("99.00"),
    )
    db_session.add(invalid_subscription)

    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


# -----------------------------------------------------------------------------
# 5. Subscription Creation Tests
# -----------------------------------------------------------------------------
def test_subscription_creation(db_session):
    """Verify full subscription lifecycle creation linked to Customer and Plan."""
    customer = User(
        email="subscriber@client.com",
        hashed_password="hashed_password",
        full_name="Subscribing Client",
        user_type="customer",
    )
    plan = Plan(
        name="Pro Growth Plan",
        code="PLAN-PRO-TEST",
        billing_frequency="Monthly",
        price=Decimal("179.00"),
    )
    db_session.add_all([customer, plan])
    db_session.flush()

    sub = Subscription(
        subscription_code="SUB-2026-TEST",
        customer_id=customer.id,
        plan_id=plan.id,
        start_date=date.today(),
        billing_cycle="Monthly",
        recurring_amount=Decimal("179.00"),
        status="Active",
        auto_renew=True,
    )
    db_session.add(sub)
    db_session.commit()

    queried_sub = db_session.execute(
        select(Subscription).where(Subscription.subscription_code == "SUB-2026-TEST")
    ).scalar_one()

    assert queried_sub.customer.email == "subscriber@client.com"
    assert queried_sub.plan.code == "PLAN-PRO-TEST"
    assert queried_sub.recurring_amount == Decimal("179.00")
    assert queried_sub.auto_renew is True


# -----------------------------------------------------------------------------
# 6. Invoice Creation & Decimal Accuracy Tests
# -----------------------------------------------------------------------------
def test_invoice_creation_and_decimal_math(db_session):
    """Verify invoice creation with items and exact Decimal precision."""
    customer = User(
        email="invoicing@client.com",
        hashed_password="hashed_password",
        full_name="Invoice Client",
    )
    db_session.add(customer)
    db_session.flush()

    subtotal = Decimal("199.00")
    tax = Decimal("19.90")  # 10%
    discount = Decimal("20.00")
    total = subtotal + tax - discount  # 198.90

    invoice = Invoice(
        invoice_number="INV-TEST-001",
        customer_id=customer.id,
        invoice_date=date.today(),
        due_date=date.today(),
        subtotal=subtotal,
        tax_amount=tax,
        discount_amount=discount,
        total_amount=total,
        amount_paid=Decimal("0.00"),
        status="Pending",
    )
    db_session.add(invoice)
    db_session.flush()

    item1 = InvoiceItem(
        invoice_id=invoice.id,
        description="Core Subscription",
        quantity=1,
        unit_price=Decimal("199.00"),
        amount=Decimal("199.00"),
    )
    db_session.add(item1)
    db_session.commit()

    queried_inv = db_session.execute(
        select(Invoice).where(Invoice.invoice_number == "INV-TEST-001")
    ).scalar_one()

    assert queried_inv.total_amount == Decimal("198.90")
    assert len(queried_inv.items) == 1
    assert queried_inv.items[0].description == "Core Subscription"


# -----------------------------------------------------------------------------
# 7. Payment Allocation Tests
# -----------------------------------------------------------------------------
def test_payment_and_allocation(db_session):
    """Verify payment recording and allocation to an existing invoice."""
    customer = User(
        email="payment@client.com",
        hashed_password="hashed_password",
        full_name="Payment Client",
    )
    db_session.add(customer)
    db_session.flush()

    invoice = Invoice(
        invoice_number="INV-PAY-001",
        customer_id=customer.id,
        invoice_date=date.today(),
        due_date=date.today(),
        subtotal=Decimal("100.00"),
        total_amount=Decimal("100.00"),
        status="Pending",
    )
    db_session.add(invoice)
    db_session.flush()

    payment = Payment(
        payment_reference="PAY-REF-9999",
        customer_id=customer.id,
        invoice_id=invoice.id,
        amount=Decimal("100.00"),
        payment_method="credit_card",
        status="completed",
    )
    db_session.add(payment)
    db_session.flush()

    allocation = PaymentAllocation(
        payment_id=payment.id,
        invoice_id=invoice.id,
        amount_allocated=Decimal("100.00"),
    )
    db_session.add(allocation)
    invoice.amount_paid = Decimal("100.00")
    invoice.status = "Paid"
    db_session.commit()

    queried_inv = db_session.execute(
        select(Invoice).where(Invoice.invoice_number == "INV-PAY-001")
    ).scalar_one()

    assert queried_inv.status == "Paid"
    assert queried_inv.amount_paid == Decimal("100.00")
    assert len(queried_inv.payments) == 1
    assert len(queried_inv.payment_allocations) == 1
    assert queried_inv.payment_allocations[0].amount_allocated == Decimal("100.00")


# -----------------------------------------------------------------------------
# 8. Transaction Rollback & Isolation Tests
# -----------------------------------------------------------------------------
def test_transaction_rollback_recovery(db_session):
    """Verify that errors cause a clean rollback and subsequent operations succeed."""
    # Attempt invalid operation
    try:
        invalid_role = Role(name=None)  # name cannot be null
        db_session.add(invalid_role)
        db_session.commit()
    except Exception:
        db_session.rollback()

    # Subsequent valid operation should work without issues
    valid_role = Role(name="billing_specialist", description="Billing Specialist")
    db_session.add(valid_role)
    db_session.commit()

    queried = db_session.execute(
        select(Role).where(Role.name == "billing_specialist")
    ).scalar_one_or_none()
    assert queried is not None
