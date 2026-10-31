# Brightloop Subscription Management System - Database Schema Documentation

This document describes all tables, columns, indexes, foreign key relationships, and data constraints for the normalized PostgreSQL database `brightloop_subscription_db`.

---

## 1. Authentication Domain

### `users`
Primary accounts directory for customers, staff, and administrators.
- `id` (VARCHAR(36), PK): UUID identifier.
- `email` (VARCHAR(255), UNIQUE, NOT NULL, INDEX): Normalized login and notification address.
- `hashed_password` (VARCHAR(255), NOT NULL): Bcrypt hashed credential.
- `full_name` (VARCHAR(255), NOT NULL): Contact display name.
- `phone` (VARCHAR(50), NULL): E.164 formatted international telephone number.
- `user_type` (VARCHAR(50), NOT NULL, INDEX, DEFAULT 'customer'): Account classification (`customer`, `staff`, `admin`).
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true): Account suspension flag.
- `is_verified` (BOOLEAN, NOT NULL, DEFAULT false): Email verification confirmation.
- `avatar_url` (VARCHAR(500), NULL): Profile photo / Google avatar URL.
- `google_id` (VARCHAR(255), NULL, INDEX): Google OAuth subject ID.
- `last_login_at` (TIMESTAMP WITH TIME ZONE, NULL): Timestamp of latest session establishment.
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()): Registration time.
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()): Last modification time.

### `roles`
Role-based access control (RBAC) definitions.
- `id` (INTEGER, PK, SERIAL): Incremental role ID.
- `name` (VARCHAR(50), UNIQUE, NOT NULL, INDEX): Standard system identifier (`admin`, `staff`, `billing_manager`, `sales_rep`, `customer`).
- `description` (TEXT, NULL): Human-readable permission scope summary.
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `user_roles`
Many-to-many relationship linking users to multiple RBAC roles.
- `user_id` (VARCHAR(36), PK, FK -> `users.id` ON DELETE CASCADE).
- `role_id` (INTEGER, PK, FK -> `roles.id` ON DELETE CASCADE).
- `assigned_at` (TIMESTAMP WITH TIME ZONE, DEFAULT now()).

### `email_verification_tokens`
Cryptographically secure single-use email verification tokens.
- `id` (INTEGER, PK, SERIAL).
- `user_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE CASCADE).
- `token` (VARCHAR(255), UNIQUE, NOT NULL, INDEX).
- `expires_at` (TIMESTAMP WITH TIME ZONE, NOT NULL): Expiration deadline.
- `is_used` (BOOLEAN, NOT NULL, DEFAULT false).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `password_reset_tokens`
Time-limited password reset dispatch tokens.
- `id` (INTEGER, PK, SERIAL).
- `user_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE CASCADE).
- `token` (VARCHAR(255), UNIQUE, NOT NULL, INDEX).
- `expires_at` (TIMESTAMP WITH TIME ZONE, NOT NULL).
- `is_used` (BOOLEAN, NOT NULL, DEFAULT false).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

---

## 2. Organization Domain (Single-Company Brightloop)

### `organization_members`
Brightloop Software internal staff and admin metadata. Brightloop is modeled as a single organization (not multi-tenant); end customers have user accounts without organization member profiles.
- `id` (VARCHAR(36), PK).
- `user_id` (VARCHAR(36), UNIQUE, NOT NULL, INDEX, FK -> `users.id` ON DELETE CASCADE).
- `department` (VARCHAR(100), NOT NULL, DEFAULT 'Operations'): Department designation (`Engineering`, `Finance`, `Sales`, `Operations`, `Support`).
- `job_title` (VARCHAR(150), NOT NULL, DEFAULT 'Staff Member').
- `is_lead` (BOOLEAN, NOT NULL, DEFAULT false): Team leadership flag.
- `permissions` (JSON, NULL): Module-level functional privilege toggles.
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

---

## 3. Product Catalog Domain

### `products`
Billable software solutions, add-on modules, and infrastructure packages.
- `id` (VARCHAR(36), PK).
- `name` (VARCHAR(255), NOT NULL, INDEX): Catalog listing title.
- `code` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): System SKU prefix (e.g. `BL-CORE`).
- `type` (VARCHAR(100), NOT NULL, DEFAULT 'Service / SaaS'): Classification.
- `description` (TEXT, NULL).
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `product_variants`
Specific SKUs, license tiers, or volume packages for each product.
- `id` (VARCHAR(36), PK).
- `product_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `products.id` ON DELETE CASCADE).
- `name` (VARCHAR(255), NOT NULL): Variant title (e.g. `100k requests / month`).
- `sku` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): Stock keeping unit.
- `sales_price` (NUMERIC(12, 2), NOT NULL): Baseline retail price.
- `cost_price` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00): COGS / infrastructure cost.
- `attributes` (JSON, NULL): Custom configuration key-value attributes.
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

---

## 4. Subscription Plans Domain

### `plans`
Standard recurring billing tiers (Starter, Growth, Enterprise).
- `id` (VARCHAR(36), PK).
- `name` (VARCHAR(255), NOT NULL).
- `code` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): e.g. `PLAN-PRO`.
- `description` (TEXT, NULL).
- `billing_frequency` (VARCHAR(50), NOT NULL, DEFAULT 'Monthly'): `Weekly`, `Monthly`, `Quarterly`, `Annual`.
- `price` (NUMERIC(12, 2), NOT NULL): Recurring rate per cadence period.
- `minimum_quantity` (INTEGER, NOT NULL, DEFAULT 1): Minimum seat or license threshold.
- `availability_period` (VARCHAR(100), NOT NULL, DEFAULT 'Always Available').
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true).
- `features` (JSON, NULL): Bullet point capability list.
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `plan_products`
Many-to-many mapping of products and variants bundled within a subscription plan.
- `id` (VARCHAR(36), PK).
- `plan_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `plans.id` ON DELETE CASCADE).
- `product_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `products.id` ON DELETE CASCADE).
- `variant_id` (VARCHAR(36), NULL, FK -> `product_variants.id` ON DELETE SET NULL).
- `is_included` (BOOLEAN, NOT NULL, DEFAULT true).
- `sort_order` (INTEGER, NOT NULL, DEFAULT 0).

---

## 5. Commercial Quotations Domain

### `quotation_templates`
Pre-approved contractual terms and condition boilerplates.
- `id` (VARCHAR(36), PK).
- `name` (VARCHAR(255), NOT NULL).
- `terms_and_conditions` (TEXT, NULL).
- `default_validity_days` (INTEGER, NOT NULL, DEFAULT 30).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `quotations`
Commercial sales proposals issued to clients.
- `id` (VARCHAR(36), PK).
- `quotation_number` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): e.g. `QT-2025-089`.
- `customer_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE RESTRICT).
- `template_id` (VARCHAR(36), NULL, FK -> `quotation_templates.id` ON DELETE SET NULL).
- `status` (VARCHAR(50), NOT NULL, INDEX, DEFAULT 'Draft'): `Draft`, `Sent`, `Accepted`, `Rejected`, `Expired`.
- `total_amount` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00).
- `validity_date` (DATE, NULL): Offer expiration deadline.
- `notes` (TEXT, NULL).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `quotation_items`
Individual line items itemized on a commercial proposal.
- `id` (VARCHAR(36), PK).
- `quotation_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `quotations.id` ON DELETE CASCADE).
- `product_id` (VARCHAR(36), NULL, FK -> `products.id` ON DELETE SET NULL).
- `variant_id` (VARCHAR(36), NULL, FK -> `product_variants.id` ON DELETE SET NULL).
- `description` (VARCHAR(255), NOT NULL).
- `quantity` (INTEGER, NOT NULL, DEFAULT 1).
- `unit_price` (NUMERIC(12, 2), NOT NULL).
- `total_amount` (NUMERIC(12, 2), NOT NULL).

---

## 6. Subscriptions Domain

### `subscriptions`
Active and recurring customer contracts.
- `id` (VARCHAR(36), PK).
- `subscription_code` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): e.g. `SUB-8401`.
- `customer_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE RESTRICT).
- `plan_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `plans.id` ON DELETE RESTRICT).
- `quotation_id` (VARCHAR(36), NULL, FK -> `quotations.id` ON DELETE SET NULL).
- `start_date` (DATE, NOT NULL): Contract activation date.
- `expiry_date` (DATE, NULL): Term expiration date.
- `next_billing_date` (DATE, NULL, INDEX): Automated invoice trigger date.
- `billing_cycle` (VARCHAR(50), NOT NULL, DEFAULT 'Monthly'): Recurring cadence.
- `status` (VARCHAR(50), NOT NULL, INDEX, DEFAULT 'Active'): `Active`, `Pending`, `Suspended`, `Cancelled`, `Expired`.
- `auto_renew` (BOOLEAN, NOT NULL, DEFAULT true): Automated recurring renewal toggle.
- `recurring_amount` (NUMERIC(12, 2), NOT NULL): Normalized price per cycle.
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `subscription_items`
Provisioned seats, services, or add-ons under the active subscription.
- `id` (VARCHAR(36), PK).
- `subscription_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `subscriptions.id` ON DELETE CASCADE).
- `product_id` (VARCHAR(36), NOT NULL, FK -> `products.id` ON DELETE RESTRICT).
- `variant_id` (VARCHAR(36), NULL, FK -> `product_variants.id` ON DELETE SET NULL).
- `quantity` (INTEGER, NOT NULL, DEFAULT 1).
- `unit_price` (NUMERIC(12, 2), NOT NULL).
- `total_price` (NUMERIC(12, 2), NOT NULL).

---

## 7. Billing & Invoicing Domain

### `invoices`
Accounts receivable ledger bills issued to clients.
- `id` (VARCHAR(36), PK).
- `invoice_number` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): e.g. `INV-2025-1082`.
- `subscription_id` (VARCHAR(36), NULL, INDEX, FK -> `subscriptions.id` ON DELETE SET NULL).
- `customer_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE RESTRICT).
- `invoice_date` (DATE, NOT NULL).
- `due_date` (DATE, NOT NULL).
- `subtotal` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00).
- `tax_amount` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00).
- `discount_amount` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00).
- `total_amount` (NUMERIC(12, 2), NOT NULL).
- `amount_paid` (NUMERIC(12, 2), NOT NULL, DEFAULT 0.00).
- `status` (VARCHAR(50), NOT NULL, INDEX, DEFAULT 'Pending'): `Draft`, `Pending`, `Paid`, `Overdue`, `Cancelled`.
- `payment_method` (VARCHAR(100), NULL).
- `notes` (TEXT, NULL).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `invoice_items`
Itemized line entries for each invoice.
- `id` (VARCHAR(36), PK).
- `invoice_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `invoices.id` ON DELETE CASCADE).
- `description` (VARCHAR(255), NOT NULL).
- `quantity` (INTEGER, NOT NULL, DEFAULT 1).
- `unit_price` (NUMERIC(12, 2), NOT NULL).
- `amount` (NUMERIC(12, 2), NOT NULL).

---

## 8. Taxes & Discounts Domain

### `tax_rules`
Jurisdiction-specific tax assessment rules.
- `id` (VARCHAR(36), PK).
- `name` (VARCHAR(100), NOT NULL).
- `tax_type` (VARCHAR(50), NOT NULL, DEFAULT 'Percentage'): `Percentage`, `Fixed`.
- `rate` (NUMERIC(6, 4), NOT NULL): Exact rate (e.g. `0.0825` for 8.25%).
- `country` (VARCHAR(100), NOT NULL, DEFAULT 'US').
- `state` (VARCHAR(100), NULL).
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `discounts`
Promotional codes and contractual discounts.
- `id` (VARCHAR(36), PK).
- `code` (VARCHAR(50), UNIQUE, NOT NULL, INDEX): e.g. `EARLYBIRD20`.
- `name` (VARCHAR(255), NOT NULL).
- `discount_type` (VARCHAR(50), NOT NULL, DEFAULT 'Percentage'): `Percentage`, `Fixed`.
- `value` (NUMERIC(12, 2), NOT NULL): Percentage rate or fixed dollar amount.
- `start_date` (DATE, NOT NULL).
- `end_date` (DATE, NOT NULL).
- `usage_limit` (INTEGER, NOT NULL, DEFAULT 100).
- `used_count` (INTEGER, NOT NULL, DEFAULT 0).
- `is_active` (BOOLEAN, NOT NULL, DEFAULT true).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `discount_usage`
Historical ledger of discount code redemptions.
- `id` (VARCHAR(36), PK).
- `discount_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `discounts.id` ON DELETE CASCADE).
- `customer_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE CASCADE).
- `invoice_id` (VARCHAR(36), NULL, INDEX, FK -> `invoices.id` ON DELETE SET NULL).
- `amount_discounted` (NUMERIC(12, 2), NOT NULL).
- `used_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

---

## 9. Payments & Settlements Domain

### `payments`
Cash, credit card, and ACH settlements received from clients.
- `id` (VARCHAR(36), PK).
- `payment_reference` (VARCHAR(100), UNIQUE, NOT NULL, INDEX): e.g. `PAY-7710`.
- `customer_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `users.id` ON DELETE RESTRICT).
- `invoice_id` (VARCHAR(36), NULL, FK -> `invoices.id` ON DELETE SET NULL).
- `amount` (NUMERIC(12, 2), NOT NULL).
- `payment_method` (VARCHAR(50), NOT NULL, DEFAULT 'credit_card'): `credit_card`, `ach`, `wire_transfer`, `stripe`.
- `payment_date` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `status` (VARCHAR(50), NOT NULL, INDEX, DEFAULT 'completed'): `completed`, `processing`, `failed`, `refunded`.
- `gateway_transaction_id` (VARCHAR(255), NULL, INDEX): External gateway transaction ID.
- `notes` (TEXT, NULL).
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).

### `payment_allocations`
Ledger reconciliation tracking which invoices a given payment settles.
- `id` (VARCHAR(36), PK).
- `payment_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `payments.id` ON DELETE CASCADE).
- `invoice_id` (VARCHAR(36), NOT NULL, INDEX, FK -> `invoices.id` ON DELETE CASCADE).
- `amount_allocated` (NUMERIC(12, 2), NOT NULL).
- `allocated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT now()).
