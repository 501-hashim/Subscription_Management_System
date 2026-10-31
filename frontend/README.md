# Brightloop Subscription Management System – Frontend Application

<div align="center">

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.15-22C55E?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://recharts.org/)
[![jsPDF](https://img.shields.io/badge/jsPDF-AutoTable-EA580C?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)](https://github.com/parallax/jsPDF)

**High-performance, dual-role enterprise SaaS web application for subscription provisioning, client self-service, and financial operations.**

</div>

---

## 📌 Overview

The frontend is a single-page React 18 application powered by Vite and Tailwind CSS. It is architected with a **Dual-Experience Role-Based Access Control (RBAC)** model that provides targeted interfaces for both back-office administrators and end-customer subscribers:

1. **Admin Operations Console**: Comprehensive quote-to-cash lifecycle, product catalog management, plan configuration, recurring contract tracking, invoice generation, discount campaigns, and executive telemetry.
2. **Client Self-Service User Portal**: Subscriber workspace for browsing SaaS products, plan checkout with real-time coupon validation, active subscription management, payment method administration, and instant client-side PDF tax invoice generation.

---

## 🚀 Key Features

* **Dual-Experience Routing & RBAC**: Automated view routing based on user persona (`admin` / `staff` vs. `customer` / `organization`).
* **Predefined Quick Sign-In**: Instant demo persona switcher for testing both Admin and Client User Portal flows with a single click.
* **Interactive Product Catalog**: Supports both responsive Grid View (featuring feature highlights, pricing, and SLA badges) and compact Table View with search, filtering, and sorting.
* **Self-Service Subscription Checkout**: Dynamic modal with coupon discount engine, proration math, and instant confirmation.
* **Client-Side PDF Invoicing**: High-fidelity, branded PDF invoice generation using `jsPDF` and `jspdf-autotable` with printable layout, itemized tables, tax breakdown, and company branding.
* **Executive Telemetry & Financial Charts**: Interactive visualizations using Recharts (MRR trends, customer growth, churn velocity, and collections breakdown).
* **Resilient Data Architecture**: Seamless offline mock data store with live API synchronization to FastAPI (`/api/v1/*`) and Express (`/api/customer/*`).

---

## 📁 Source Directory Map

```text
frontend/src/
├── components/
│   ├── common/             # Atomic UI: Button, Badge, Card, DataTable, Modal, StatsCard, Toast
│   └── layout/             # Shell: Sidebar, Navbar, Notification Dropdown, Responsive Layout
├── data/
│   └── mockData.js         # Offline mock store & initial catalog/customer seeds
├── pages/
│   ├── Auth/               # Login & Register views with dual-role onboarding
│   ├── Customers/          # Directory, detail inspection, and customer creation
│   ├── Dashboard/          # Executive telemetry, KPI stats cards, and MRR graphs
│   ├── Discounts/          # Coupon codes and promotion rules manager
│   ├── Invoices/           # Admin invoice ledger & settlement status
│   ├── Payments/           # Payment transactions and settlement health
│   ├── Plans/              # Subscription package matrix and tier manager
│   ├── Products/           # Product catalog with Grid and Table views
│   ├── Quotations/         # Proposal pipeline & quotation lifecycle
│   ├── Reports/            # Financial reporting, MRR by tier, collection breakdown
│   ├── Settings/           # Company legal identity & RBAC matrix
│   └── UserPortal/         # Client Self-Service Portal:
│       ├── ProductCatalog.jsx              # Customer product & plan explorer
│       ├── SubscriptionCheckoutModal.jsx   # Plan checkout modal with discount code engine
│       ├── UserDashboardTab.jsx            # My Subscriptions & renewal countdowns
│       ├── UserInvoices.jsx                # Invoice history & instant PDF downloads
│       ├── UserPayments.jsx                # Payment history & card management
│       └── UserPortalPage.jsx              # Tabbed portal wrapper with role guards
├── services/
│   ├── authDatabase.js     # User registration, authentication, & session state
│   └── userApi.js          # REST client communicating with backend & customer APIs
├── utils/
│   ├── authPermissions.js  # Role & permission validation helpers
│   ├── formatters.js       # Currency (USD), date, and badge styling utilities
│   └── invoicePdfGenerator.js # Client-side PDF invoice builder (jsPDF)
├── App.jsx                 # Top-level state controller & routing shell
├── index.css               # Tailwind directives & theme styles
└── main.jsx                # React DOM mounting entrypoint
```

---

## 🛠️ Local Development

### Prerequisites
* Node.js `18.x` or higher
* npm `9.x` or higher

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Compile optimized production build
npm run build

# 4. Preview production build locally
npm run preview
```

The application runs by default on [http://localhost:5173](http://localhost:5173).

---

## 🧪 Build & Linting Verification

The build uses Vite and Rollup with complete ES module tree shaking:
```bash
npm run build
```
Output bundles are written to `frontend/dist/`.
