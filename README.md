# Brightloop Software – Subscription Management System
> **Odoo X Make-A-Ton Virtual Hackathon Project**  
> *Full-Stack Monorepo: Frontend Prototype & FastAPI Integration Microservice*

---

## 📌 Executive Summary

**Brightloop Subscription Management System** is a modern, enterprise SaaS billing and contract lifecycle platform built for **Brightloop Software**. It unifies recurring contract provisioning, product catalog configuration, quotation generation, automated invoicing, settlement reconciliation, and high-level financial reporting.

The repository is organized into cleanly separated **`frontend/`** and **`backend/`** services, providing the development team with an intuitive, decoupled foundation for independent feature development.

---

## 📁 Repository Structure

```text
Subscription_Management_System/
├── frontend/                       # Vite + React 18 + Tailwind CSS Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Atomic UI: Badge, Button, Card, DataTable, Modal, StatsCard
│   │   │   └── layout/             # Shell: Sidebar, Navbar, Responsive Layout wrapper
│   │   ├── data/
│   │   │   └── mockData.js         # Centralized mock data store for in-memory prototype testing
│   │   ├── pages/
│   │   │   ├── Customers/          # Client account directory & creation modals
│   │   │   ├── Dashboard/          # KPI metrics, MRR area charts, churn trends, overdue alerts
│   │   │   ├── Discounts/          # Promotional campaign & coupon code manager
│   │   │   ├── Invoices/           # Receivable invoices, payment status, & PDF download action
│   │   │   ├── Payments/           # Settled payment transactions & settlement health
│   │   │   ├── Plans/              # Subscription tier matrix (Card & Table views)
│   │   │   ├── Products/           # Catalog items, service SKUs, and variant tags
│   │   │   ├── Quotations/         # Commercial proposal pipeline & status lifecycles
│   │   │   ├── Reports/            # Date filters, MRR by tier bar chart, collections donut
│   │   │   ├── Settings/           # Company legal identity, user accounts, & RBAC matrix
│   │   │   └── Subscriptions/      # Active contracts, billing intervals, & renewal metadata
│   │   ├── utils/
│   │   │   └── formatters.js       # Currency (USD), date, and styling utilities
│   │   ├── App.jsx                 # Top-level state controller & routing
│   │   ├── index.css               # Global typography & Tailwind styling
│   │   └── main.jsx                # DOM mounting entry point
│   ├── Dockerfile                  # Multi-stage production build & Nginx serving
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── backend/                        # FastAPI (Python 3.12) Microservice & Odoo Connector
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/      # Modular REST endpoints (Dashboard, Customers, Plans, etc.)
│   │   │       └── api.py          # Unified API router mounting all 10 feature domains
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic v2 validation models & request/response types
│   │   ├── services/
│   │   │   ├── billing_engine.py   # Normalized MRR calculations & automated billing cycles
│   │   │   └── odoo_client.py      # Odoo XML-RPC client for partner, order & invoice sync
│   │   ├── config.py               # Application settings, CORS, & Odoo credentials
│   │   └── main.py                 # FastAPI application factory
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── docker-compose.yml              # Local orchestration (Frontend, Backend, Odoo 17, Postgres)
├── .gitignore                      # Monorepo git ignore rules
└── README.md                       # Monorepo architecture guide
```

---

## ⚡ Quickstart Guide

### 1. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** to access the dashboard.

To compile a production build:
```bash
npm run build
```

---

### 2. Backend Setup (FastAPI + Python 3.12)
```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- **API Documentation (Swagger UI):** `http://localhost:8000/api/v1/docs`
- **ReDoc:** `http://localhost:8000/api/v1/redoc`
- **Health Check:** `http://localhost:8000/health`

---

### 3. Docker Compose (Full Stack Orchestration)
To spin up the entire hackathon stack (Frontend, Backend, Odoo 17, and PostgreSQL):
```bash
docker-compose up --build
```

---

## 🧩 Functional Module Matrix

| Module | Frontend View | Backend REST API | Odoo Model Mapping |
| :--- | :--- | :--- | :--- |
| **Dashboard** | KPI Cards, MRR Chart, Churn Graph | `GET /api/v1/dashboard/kpis` | Aggregate Reports |
| **Customers** | Search, Status Filters, Add/View Modal | `GET/POST /api/v1/customers` | `res.partner` |
| **Products** | Catalog SKUs, Variant Tags, Pricing | `GET/POST /api/v1/products` | `product.template` |
| **Plans** | Multi-tier cards, Min Seats, Billing Cadence | `GET/POST /api/v1/plans` | `product.product` |
| **Quotations** | Proposal pipeline, Validity Expirations | `GET/POST /api/v1/quotations` | `sale.order` (draft) |
| **Subscriptions** | Contract lifecycles, Auto-renewal flags | `GET/POST /api/v1/subscriptions` | `sale.order` (confirmed) |
| **Invoices** | Billing registry, Status badges, PDF action | `GET/POST /api/v1/invoices` | `account.move` |
| **Payments** | Settlement ledger, Gateway methods (ACH/Card) | `GET/POST /api/v1/payments` | `account.payment` |
| **Discounts** | Coupon codes (percentage & fixed rate limits) | `GET/POST /api/v1/discounts` | Loyalty & Discounts |
| **Reports** | Period filters, MRR by Tier, Collection donut | `GET /api/v1/reports/summary` | Financial Ledgers |
| **Settings** | Company details, User invites, RBAC matrix | `/health` / System configs | `res.company` / `res.users` |

---

## 🌿 Git Branching Strategy

1. **`master`** – Main production integration branch. **Never modify directly.**
2. **`prototype`** – Leader's active development branch. All prototype enhancements and PRs branch from here.
3. **Pull Request Workflow:** All feature PRs target `master` from `prototype` upon team review.

---

## 👥 Hackathon Team
- **Lead Developer:** Hashim ([@501-hashim](https://github.com/501-hashim))
- **Event:** Odoo X Make-A-Ton Virtual Hackathon
- **Organization:** Brightloop Software Inc.
