# Brightloop Subscription Management System – Backend API & Odoo Integration

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![Alembic](https://img.shields.io/badge/Alembic-1.13-CC292B?style=for-the-badge&logo=alembic&logoColor=white)](https://alembic.sqlalchemy.org/)
[![Pytest](https://img.shields.io/badge/Pytest-8%20Passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](https://pytest.org/)
[![Pydantic](https://img.shields.io/badge/Pydantic-v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white)](https://docs.pydantic.dev/)

**High-throughput asynchronous REST API, recurring billing engine, and Odoo 17 ERP XML-RPC synchronization service.**

</div>

---

## 📌 Architecture Overview

The backend microservice is built with **FastAPI** (Python 3.12) to serve as the core transactional engine and enterprise bridge for the Brightloop Subscription Management platform.

### Core Architecture Components:
* **Modular REST Endpoints (`/api/v1/*`)**: Domain-driven API routers covering Customers, Products, Plans, Quotations, Subscriptions, Invoices, Payments, Discounts, Reports, and Dashboard KPIs.
* **Declarative SQLAlchemy 2.0 ORM**: 22 normalized database models with strict foreign key constraints, cascade rules, UTC timezone handling, and `Numeric(12, 2)` monetary precision.
* **Alembic Schema Versioning**: Automated database migrations with model autodiscovery and environment-aware connection pooling.
* **Recurring Billing & Proration Engine**: Calculates normalized MRR, cycle intervals, grace periods, and automated renewal triggers.
* **Odoo 17 ERP XML-RPC Client**: Asynchronous synchronization engine connecting contacts (`res.partner`), catalog items (`product.template`), sales orders (`sale.order`), and accounting journal entries (`account.move`).
* **Automated Test Suite**: Integrated `pytest` suite validating transactional integrity, unique constraints, and ACID rollback behavior.

---

## 📁 Source Directory Map

```text
backend/
├── alembic/
│   ├── versions/           # Versioned migration scripts (20261031_001_initial_schema.py)
│   ├── env.py              # Dynamic configuration & model autodiscovery
│   └── script.py.mako
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/  # Modular API controllers:
│   │       │   ├── customers.py
│   │       │   ├── dashboard.py
│   │       │   ├── discounts.py
│   │       │   ├── invoices.py
│   │       │   ├── payments.py
│   │       │   ├── plans.py
│   │       │   ├── products.py
│   │       │   ├── quotations.py
│   │       │   ├── reports.py
│   │       │   └── subscriptions.py
│   │       └── api.py      # Unified router mounting all domain endpoints
│   ├── core/
│   │   └── config.py       # Pydantic Settings with connection URL normalization
│   ├── db/
│   │   ├── base.py         # Single entry point importing Base and all 22 models
│   │   ├── base_class.py   # DeclarativeBase and TimestampMixin
│   │   └── session.py      # Engine factory, QueuePool, and get_db dependency
│   ├── modules/            # Domain-organized SQLAlchemy 2.0 models:
│   │   ├── auth/models.py
│   │   ├── billing/models.py
│   │   ├── organization/models.py
│   │   ├── payments/models.py
│   │   ├── plans/models.py
│   │   ├── products/models.py
│   │   ├── quotations/models.py
│   │   ├── subscriptions/models.py
│   │   └── tax_discounts/models.py
│   ├── services/
│   │   ├── billing_engine.py   # MRR calculation & billing cycle scheduler
│   │   └── odoo_client.py      # XML-RPC client for Odoo 17 integration
│   └── main.py             # FastAPI app factory, CORS, and health endpoints
├── tests/
│   ├── test_database.py    # 8 comprehensive integration & transactional tests
│   └── conftest.py
├── Dockerfile              # Production Python 3.12 container definition
├── requirements.txt
└── alembic.ini
```

---

## 🛠️ Local Development & Execution

### Prerequisites
* Python `3.12` or higher
* PostgreSQL `15+` running locally or via Docker

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations
alembic upgrade head

# 5. Start the development server
uvicorn app.main:app --reload --port 8000
```

### Interactive Documentation & Endpoints
* **Swagger UI:** [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
* **ReDoc:** [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)
* **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Testing

Run the full integration test suite against the PostgreSQL engine:
```bash
pytest tests/test_database.py -v
```

All 8 tests verify strict transactional guarantees, unique constraint validations, decimal math, and rollback safety.
