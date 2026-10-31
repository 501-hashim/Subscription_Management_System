# Brightloop Subscription Management System – Customer Portal API Service

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.3-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**Lightweight, dedicated Node.js/Express API service powering the Client Self-Service Portal.**

</div>

---

## 📌 Overview

The `server/` directory contains an Express.js API service dedicated to powering customer-facing self-service interactions, including customer dashboard telemetry, subscription provisioning, invoice history retrieval, and payment processing.

---

## 📁 Source Directory Map

```text
server/
├── db/
│   ├── db.js               # PostgreSQL connection pool & query helpers
│   ├── schema.sql          # Lightweight relational schema definitions
│   └── seed.sql            # Demo catalog and customer seed data
├── middleware/
│   └── auth.js             # Customer authentication & JWT validation
├── routes/
│   └── customerRoutes.js   # Customer endpoints (/api/customer, /api/user)
├── test/
│   └── customerFlow.test.js # Customer checkout & lifecycle test suite
└── index.js                # Express app entry point
```

---

## 🚀 Setup & Execution

### Prerequisites
* Node.js `18.x` or higher
* PostgreSQL running on port `5432`

```bash
# 1. From repository root (or frontend directory)
npm run server

# Alternatively, directly with node:
node server/index.js
```

The service runs by default on [http://localhost:5000](http://localhost:5000).

### Key Endpoints
* `GET /api/health` - Service health status
* `GET /api/customer/dashboard` - Customer overview metrics & active subscriptions
* `GET /api/customer/subscriptions` - Active customer contracts and remaining days
* `POST /api/customer/subscriptions` - Provision new subscription via checkout
* `GET /api/customer/invoices` - Historical invoices & settlement status
* `GET /api/customer/payments` - Transaction history and payment methods
