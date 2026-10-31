# Brightloop Subscription Management System - Database Infrastructure Guide

This repository contains the complete PostgreSQL database architecture, declarative SQLAlchemy 2.0 models, Alembic migrations, administrative scripts, and documentation for the **Brightloop Subscription Management System**.

---

## 📌 Architecture Highlights
- **Engine:** PostgreSQL 15+ (Database: `brightloop_subscription_db`)
- **ORM:** SQLAlchemy 2.0 (Declarative Base, strict foreign keys, timezone-aware UTC timestamps, `Numeric(12, 2)` monetary precision)
- **Migrations:** Alembic with model autodiscovery and environment-aware connection string normalization.
- **Portability:** Seamless compatibility across Local Docker, Local PostgreSQL, and Cloud Providers (Neon, Render, Azure, AWS RDS) via `DATABASE_URL`.
- **Connection Pooling:** Tuned `QueuePool` with `pool_pre_ping=True` and `pool_recycle=1800` for resilient cloud serverless connections.

---

## 📁 Folder Structure

```text
database/
├── docs/
│   ├── DATABASE_SCHEMA.md      # Detailed column definitions, indexes, & foreign keys
│   └── ER_DIAGRAM.md           # Mermaid Entity-Relationship Diagram
├── scripts/
│   ├── init_db.py              # Connectivity check, Alembic migration, admin setup, & seeding
│   └── reset_db.py             # Safe development reset (blocked in production)
├── seeds/
│   └── data.py                 # Sanitized catalog, tier plans, tax rules, & demo customers
└── README.md                   # This operations and setup guide

backend/
├── alembic/
│   ├── versions/
│   │   └── 20261031_001_initial_schema.py   # Baseline schema migration (all 22 tables)
│   ├── env.py                  # Dynamic config & model discovery
│   └── script.py.mako
├── alembic.ini                 # Alembic configuration
├── app/
│   ├── core/
│   │   └── config.py           # Pydantic Settings with connection URL normalization
│   ├── db/
│   │   ├── base.py             # Single entrypoint importing Base and all 22 models
│   │   ├── base_class.py       # DeclarativeBase and TimestampMixin
│   │   └── session.py          # Engine, connection pooling, and get_db dependency
│   └── modules/                # Domain-organized SQLAlchemy 2.0 models
│       ├── auth/models.py
│       ├── organization/models.py
│       ├── products/models.py
│       ├── plans/models.py
│       ├── quotations/models.py
│       ├── subscriptions/models.py
│       ├── billing/models.py
│       ├── tax_discounts/models.py
│       └── payments/models.py
└── .env.example
```

---

## 🛠️ Step 1: Setting Up PostgreSQL

### Option A: Using Docker (Recommended for Local Dev)
Run PostgreSQL in a container using the root `docker-compose.yml`:
```bash
# Start PostgreSQL service with persistent volume
docker-compose up -d postgres
```
This initializes a container named `brightloop_postgres` on port `5432` with database `brightloop_subscription_db`.

### Option B: Using Local Native PostgreSQL
1. **Ubuntu/Debian:**
   ```bash
   sudo apt update && sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo -u postgres psql -c "CREATE DATABASE brightloop_subscription_db;"
   sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgrespassword';"
   ```
2. **macOS (Homebrew):**
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   createdb brightloop_subscription_db
   ```
3. **Windows:**
   Download and install the official PostgreSQL installer from [enterprisedb.com](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). Create database `brightloop_subscription_db` using pgAdmin or `psql`.

---

## ⚙️ Step 2: Configure Environment Variables

Copy `backend/.env.example` to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Set your connection string:
```ini
# Local PostgreSQL
DATABASE_URL=postgresql+psycopg2://postgres:postgrespassword@localhost:5432/brightloop_subscription_db

# Security & App
ENV=development
SECRET_KEY=your-random-64-character-secret-key
```

> **Note on Portability:** If your cloud host outputs `postgres://` (e.g. Render, Neon), our central configuration automatically converts it to `postgresql+psycopg2://` at runtime. No code changes are needed!

---

## 🚀 Step 3: Run Database Migrations

Always run Alembic migrations from inside the `backend/` directory:

```bash
cd backend

# 1. Apply all migrations up to head:
alembic upgrade head

# 2. Check current migration status:
alembic current

# 3. View migration history:
alembic history --verbose

# 4. Roll back the most recent migration:
alembic downgrade -1

# 5. Roll back all migrations to clean state:
alembic downgrade base

# 6. Generate a new revision after model changes:
alembic revision --autogenerate -m "add_new_feature_fields"
```

---

## 🌱 Step 4: Seed Initial Data & Create Admin

Run the interactive setup script from the repository root:

```bash
# 1. Test database connectivity only:
python database/scripts/init_db.py --check-only

# 2. Initialize schema, create initial Super Admin, and load sample catalog & customers:
python database/scripts/init_db.py --seed --admin-email admin@brightloop.io --admin-password "YourAdminPassword123!" --admin-name "Hashim Admin"

# 3. Run interactively (will prompt for admin password securely):
python database/scripts/init_db.py --seed
```

### Resetting Development Database
If you need to wipe and reset your local development environment:
```bash
python database/scripts/reset_db.py --confirm-reset
```
*(This script will strictly refuse to run if `ENV=production`)*.

---

## ☁️ Step 5: Connecting to Hosted Cloud PostgreSQL

To deploy against managed cloud databases, set `DATABASE_URL` in your provider's environment variables:

### 1. Neon PostgreSQL
```ini
DATABASE_URL=postgresql+psycopg2://<user>:<password>@ep-rapid-pool-123456.us-east-2.aws.neon.tech/brightloop_subscription_db?sslmode=require
```

### 2. Render PostgreSQL
```ini
DATABASE_URL=postgresql+psycopg2://<user>:<password>@dpg-xxxxxx.oregon-postgres.render.com/brightloop_subscription_db?sslmode=require
```

### 3. AWS RDS / Azure PostgreSQL
```ini
DATABASE_URL=postgresql+psycopg2://<user>:<password>@my-pg-instance.postgres.database.azure.com:5432/brightloop_subscription_db?sslmode=require
DB_SSL_MODE=require
```

---

## 🚢 Production Deployment Checklist

Before starting the FastAPI application service in production:

1. **Pre-deployment migration step:** Execute migrations in your build/release phase:
   ```bash
   cd backend && alembic upgrade head
   ```
2. **Never automatically drop or recreate tables:** Our production settings prevent table drops.
3. **Connection Pooling:** Tune `DB_POOL_SIZE` (default: 10), `DB_MAX_OVERFLOW` (default: 20), and `DB_POOL_RECYCLE` (default: 1800s) according to your host's connection limits.
4. **Health Check Probe:** Configure container orchestration or Kubernetes to ping:
   `GET /health` or run `check_db_connection()` to monitor connection latency and pool status.
