# Brightloop Software – Subscription Management System
> **Odoo X Make-A-Ton Virtual Hackathon Project**  
> *Frontend Skeleton Prototype & Architecture Foundation*

---

## 📌 Executive Summary

**Brightloop Subscription Management System** is a modern, enterprise-grade SaaS billing, recurring revenue, and contract lifecycle dashboard built for **Brightloop Software**. It provides a comprehensive suite of tools for managing customers, catalog products, multi-tier subscription plans, commercial quotations, billing lifecycles, invoices, payment settlements, discount promotions, and high-level financial reporting.

This repository serves as the **common UI and architecture foundation** for the development team. It is built as a modular, frontend-only skeleton prototype so different team members can independently develop features and backend integrations without modifying shared layouts.

---

## 🚀 Technology Stack

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Enterprise SaaS neutral palette with deep slate & cobalt blue)
- **Icons:** Lucide React
- **Analytics & Visualizations:** Recharts (Area, Line, Bar, and Donut/Pie charts)
- **State Management:** In-memory centralized mock data layer with responsive client mutations

---

## 📁 Project Architecture & Directory Structure

```text
Subscription_Management_System/
├── index.html                      # App entry HTML template
├── package.json                    # Project dependencies and npm scripts
├── vite.config.js                  # Vite bundler configuration & path aliases
├── tailwind.config.js              # Tailwind custom theme extensions
├── postcss.config.js               # PostCSS Autoprefixer pipeline
├── src/
│   ├── components/
│   │   ├── common/                 # Reusable atomic UI components
│   │   │   ├── Badge.jsx           # Semantic status indicator tags
│   │   │   ├── Button.jsx          # Multi-variant, accessible button component
│   │   │   ├── Card.jsx            # Card container, header, title, body, footer
│   │   │   ├── DataTable.jsx       # Enterprise table (search, status filter, pagination)
│   │   │   ├── Modal.jsx           # Accessible dialog backdrop with Esc listener
│   │   │   └── StatsCard.jsx       # KPI metric display with percentage delta
│   │   └── layout/
│   │       ├── Layout.jsx          # Shell combining Sidebar, Navbar, and Container
│   │       ├── Navbar.jsx          # Global search, notification drawer, admin profile
│   │       └── Sidebar.jsx         # 11-module primary vertical navigation
│   ├── data/
│   │   └── mockData.js             # Centralized mock data store for all entities
│   ├── pages/
│   │   ├── Customers/              # Client accounts directory & creation modal
│   │   ├── Dashboard/              # Top KPIs, MRR charts, churn trends, overdue alerts
│   │   ├── Discounts/              # Promotional coupons & percentage rate campaigns
│   │   ├── Invoices/               # Receivable invoices, cycle statuses, mock PDF export
│   │   ├── Payments/               # Gateway transactions, settlement status, ACH/card
│   │   ├── Plans/                  # Tier definitions, cadence parameters, card/table view
│   │   ├── Products/               # Catalog products, service SKUs, variant definitions
│   │   ├── Quotations/             # Commercial proposals, validity windows, status
│   │   ├── Reports/                # Period filters, MRR by tier, collections breakdown
│   │   ├── Settings/               # Company legal identity, user list, RBAC matrix
│   │   └── Subscriptions/          # Active contracts, renewals, auto-renew metadata
│   ├── utils/
│   │   └── formatters.js           # Currency (USD), date, and class merging utilities
│   ├── App.jsx                     # Top-level state and routing controller
│   ├── index.css                   # Tailwind directives and clean scrollbar styling
│   └── main.jsx                    # React DOM mounting entry point
└── README.md
```

---

## 🧩 Modules & Key Features

| Module | Key Capabilities |
| :--- | :--- |
| **Dashboard** | 4 primary KPIs (`Active Subscriptions`, `Total Revenue`, `Outstanding Payments`, `Overdue Invoices`), 7-month MRR Area Chart, Subscription Growth Line Chart, Recent Subscriptions and Transactions, Overdue Warning banner. |
| **Customers** | Searchable client directory, status filters (`Active`, `Inactive`, `Suspended`), view details drawer, and Add Customer modal with validation. |
| **Products** | Catalog items, SKU codes, sales & cost prices, variant tags (`Monthly`, `Annual`, etc.), and Add Product modal. |
| **Subscription Plans** | Pricing tiers with dual-view (Interactive Cards / DataTable), minimum seats, availability period, feature lists, and Add Plan modal. |
| **Quotations** | Proposal pipeline with validity dates, line items, status flow (`Draft`, `Sent`, `Accepted`, `Expired`), and Create Quotation modal. |
| **Subscriptions** | Live contract tracker with renewal countdowns, auto-renewal indicators, cycle cadence, and detail inspection modal. |
| **Invoices** | Billing registry with payment status badges (`Paid`, `Pending`, `Overdue`), PDF download action, and Create Invoice modal. |
| **Payments** | Settled transactions, payment method indicators (Credit Card, ACH, Wire Transfer), reference IDs, and transaction health metrics. |
| **Discounts** | Coupon codes (percentage and fixed amounts), validity ranges, usage counters, and Add Discount modal. |
| **Reports** | Period selector (`Last 30 Days`, `Last Quarter`, `YTD`, `All Time`), MRR by tier bar chart, collections breakdown pie chart, and overdue audit ledger. |
| **Settings** | Tabbed configuration for Company Legal Information, User Profile, Workspace User Management, and Role-Based Access Control (RBAC) matrix. |

---

## 🛠️ Installation & Setup Instructions

### Prerequisites
- Node.js: `v18.0.0` or higher (tested on Node 24)
- npm: `v9.0.0` or higher

### 1. Clone the repository
```bash
git clone https://github.com/501-hashim/Subscription_Management_System.git
cd Subscription_Management_System
```

### 2. Checkout the prototype branch
```bash
git checkout prototype
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start local development server
```bash
npm run dev
```
Open your browser at `http://localhost:5173` to interact with the prototype.

### 5. Build for production
```bash
npm run build
```
The compiled, production-ready static assets will be output in the `dist/` directory.

---

## 📐 Coding Conventions & Guidelines for Contributors

1. **Independent Page Architecture:** Each page component in `src/pages/<Module>` is self-contained. Keep page-specific helper components within their module directory.
2. **Centralized Data:** Keep default mock entities inside `src/data/mockData.js`. If you add new models or schema fields, document and update the initial arrays in that file.
3. **Component Reusability:** Always use the common UI components (`Button`, `Badge`, `Card`, `Modal`, `DataTable`, `StatsCard`) from `src/components/common/` to ensure visual consistency across all modules.
4. **Git Branching Strategy:**
   - `master`: Integration branch. **Never commit directly to `master`.**
   - `prototype`: Development integration branch for leader review and Pull Requests.
   - Feature branches: `feat/<feature-name>` branched from `prototype`.

---

## 👥 Hackathon Team & Project Info
- **Lead Developer:** Hashim ([@501-hashim](https://github.com/501-hashim))
- **Event:** Odoo X Make-A-Ton Virtual Hackathon
- **Organization:** Brightloop Software Inc.
