#!/usr/bin/env python3
"""
Brightloop Subscription Management System - Database Initialization Script
Initializes database infrastructure, runs Alembic migrations, creates initial admin,
and optionally loads sanitized sample seed data.

Usage:
    python init_db.py [--check-only] [--seed] [--admin-email EMAIL] [--admin-password PWD]
"""
import sys
import os
import argparse
import getpass
from pathlib import Path

# Add backend directory and repository root to path
backend_dir = Path(__file__).resolve().parent.parent.parent / "backend"
repo_root = Path(__file__).resolve().parent.parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(repo_root) not in sys.path:
    sys.path.insert(0, str(repo_root))

import bcrypt
from sqlalchemy import select, text
from app.core.config import settings
from app.db.session import engine, SessionLocal, check_db_connection
from app.db.base import (
    Base, User, Role, user_roles, OrganizationMember,
    Product, ProductVariant, Plan, TaxRule, Discount
)
from database.seeds.data import (
    SEED_ROLES, SEED_PRODUCTS, SEED_PLANS,
    SEED_TAX_RULES, SEED_DISCOUNTS, SEED_TEST_CUSTOMERS
)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8")[:72], salt).decode("utf-8")


def verify_connection():
    """Verify database connection health."""
    print("--> Checking database connectivity...")
    status = check_db_connection()
    if not status["connected"]:
        print(f"[!] Database connection failed: {status.get('error')}")
        print(f"[!] Target Dialect: {status.get('database_url_dialect')}")
        return False
    print(f"[OK] Database connection established successfully! Dialect: {status.get('database_url_dialect')}")
    return True


def run_migrations():
    """Runs Alembic migrations to upgrade the schema to head."""
    print("--> Running Alembic schema migrations...")
    from alembic.config import Config
    from alembic import command

    alembic_cfg_path = backend_dir / "alembic.ini"
    alembic_cfg = Config(str(alembic_cfg_path))
    alembic_cfg.set_main_option("sqlalchemy.url", settings.get_normalized_database_url())
    alembic_cfg.set_main_option("script_location", str(backend_dir / "alembic"))

    try:
        command.upgrade(alembic_cfg, "head")
        print("[OK] Schema upgraded to latest migration head.")
    except Exception as e:
        print(f"[!] Alembic migration failed: {e}. Falling back to metadata creation.")
        Base.metadata.create_all(bind=engine)
        print("[OK] Tables verified via Base.metadata.create_all.")


def seed_roles(session):
    """Seed standard system roles."""
    print("--> Seeding system roles...")
    for role_data in SEED_ROLES:
        existing = session.execute(select(Role).where(Role.name == role_data["name"])).scalar_one_or_none()
        if not existing:
            role = Role(name=role_data["name"], description=role_data["description"])
            session.add(role)
    session.commit()
    print("[OK] Roles configured.")


def create_initial_admin(session, email=None, password=None, full_name=None):
    """Securely creates or prompts for the initial Super Admin account."""
    admin_role = session.execute(select(Role).where(Role.name == "admin")).scalar_one_or_none()
    if not admin_role:
        admin_role = Role(name="admin", description="Super administrator")
        session.add(admin_role)
        session.commit()

    if not email:
        if settings.is_production:
            print("[!] In production, please specify --admin-email or enter interactively.")
        email = input("Enter Initial Admin Email [admin@brightloop.io]: ").strip() or "admin@brightloop.io"

    existing_admin = session.execute(select(User).where(User.email == email)).scalar_one_or_none()
    if existing_admin:
        print(f"[INFO] Admin user '{email}' already exists. Skipping creation.")
        return existing_admin

    if not password:
        password = getpass.getpass("Enter Initial Admin Password (min 8 chars): ").strip()
        while len(password) < 8:
            print("[!] Password must be at least 8 characters long.")
            password = getpass.getpass("Enter Initial Admin Password: ").strip()

    if not full_name:
        full_name = "Brightloop System Admin"

    hashed = hash_password(password)
    admin_user = User(
        email=email,
        hashed_password=hashed,
        full_name=full_name,
        user_type="admin",
        is_active=True,
        is_verified=True,
    )
    session.add(admin_user)
    session.flush()

    # Link to admin role
    session.execute(
        user_roles.insert().values(user_id=admin_user.id, role_id=admin_role.id)
    )

    # Link to organization member
    org_member = OrganizationMember(
        user_id=admin_user.id,
        department="Executive",
        job_title="Super Administrator",
        is_lead=True,
        permissions={"all": True, "admin": True},
    )
    session.add(org_member)
    session.commit()
    print(f"[OK] Initial Admin account '{email}' created successfully.")
    return admin_user


def seed_sample_data(session):
    """Loads realistic sanitized sample data for catalog, plans, taxes, discounts, and customers."""
    print("--> Seeding catalog products and variants...")
    for prod_data in SEED_PRODUCTS:
        existing = session.execute(select(Product).where(Product.code == prod_data["code"])).scalar_one_or_none()
        if not existing:
            product = Product(
                name=prod_data["name"],
                code=prod_data["code"],
                type=prod_data["type"],
                description=prod_data["description"],
                is_active=True,
            )
            session.add(product)
            session.flush()
            for var_data in prod_data["variants"]:
                variant = ProductVariant(
                    product_id=product.id,
                    name=var_data["name"],
                    sku=var_data["sku"],
                    sales_price=var_data["sales_price"],
                    cost_price=var_data["cost_price"],
                    attributes=var_data["attributes"],
                    is_active=True,
                )
                session.add(variant)
    session.commit()

    print("--> Seeding subscription plans...")
    for plan_data in SEED_PLANS:
        existing = session.execute(select(Plan).where(Plan.code == plan_data["code"])).scalar_one_or_none()
        if not existing:
            plan = Plan(
                name=plan_data["name"],
                code=plan_data["code"],
                description=plan_data["description"],
                billing_frequency=plan_data["billing_frequency"],
                price=plan_data["price"],
                minimum_quantity=plan_data["minimum_quantity"],
                availability_period=plan_data["availability_period"],
                features=plan_data["features"],
                is_active=True,
            )
            session.add(plan)
    session.commit()

    print("--> Seeding tax rules and promotional discounts...")
    for tax_data in SEED_TAX_RULES:
        existing = session.execute(select(TaxRule).where(TaxRule.name == tax_data["name"])).scalar_one_or_none()
        if not existing:
            session.add(TaxRule(**tax_data))

    for disc_data in SEED_DISCOUNTS:
        existing = session.execute(select(Discount).where(Discount.code == disc_data["code"])).scalar_one_or_none()
        if not existing:
            session.add(Discount(**disc_data))
    session.commit()

    print("--> Seeding sample customer accounts...")
    customer_role = session.execute(select(Role).where(Role.name == "customer")).scalar_one_or_none()
    default_cust_pwd = hash_password("BrightloopDemo123!")

    for cust_data in SEED_TEST_CUSTOMERS:
        existing = session.execute(select(User).where(User.email == cust_data["email"])).scalar_one_or_none()
        if not existing:
            cust = User(
                email=cust_data["email"],
                hashed_password=default_cust_pwd,
                full_name=cust_data["full_name"],
                phone=cust_data["phone"],
                user_type="customer",
                is_active=True,
                is_verified=True,
            )
            session.add(cust)
            session.flush()
            if customer_role:
                session.execute(
                    user_roles.insert().values(user_id=cust.id, role_id=customer_role.id)
                )
    session.commit()
    print("[OK] Sample business data loaded successfully.")


def main():
    parser = argparse.ArgumentParser(description="Brightloop Database Initialization")
    parser.add_argument("--check-only", action="store_true", help="Only verify database connectivity")
    parser.add_argument("--seed", action="store_true", help="Load sanitized sample catalog and customer seed data")
    parser.add_argument("--admin-email", type=str, help="Email for initial admin user")
    parser.add_argument("--admin-password", type=str, help="Password for initial admin user")
    parser.add_argument("--admin-name", type=str, help="Full name for initial admin user")
    args = parser.parse_args()

    if not verify_connection():
        sys.exit(1)

    if args.check_only:
        print("[OK] Connectivity check complete.")
        sys.exit(0)

    run_migrations()

    session = SessionLocal()
    try:
        seed_roles(session)
        create_initial_admin(session, args.admin_email, args.admin_password, args.admin_name)
        if args.seed:
            seed_sample_data(session)
        print("\n[OK] Database initialization completed successfully!")
    finally:
        session.close()


if __name__ == "__main__":
    main()
