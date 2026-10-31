# Brightloop Subscription Management System - Entity Relationship Diagram

This diagram documents the normalized PostgreSQL relational architecture for the **Brightloop Subscription Management System**.

```mermaid
erDiagram
    users ||--o{ user_roles : has
    roles ||--o{ user_roles : assigned_to
    users ||--o| organization_members : staff_profile
    users ||--o{ email_verification_tokens : owns
    users ||--o{ password_reset_tokens : owns
    users ||--o{ quotations : requests
    users ||--o{ subscriptions : subscribes
    users ||--o{ invoices : billed_to
    users ||--o{ payments : makes
    users ||--o{ discount_usage : redeems

    products ||--o{ product_variants : contains
    products ||--o{ plan_products : included_in
    product_variants ||--o{ plan_products : specifies
    plans ||--o{ plan_products : defines
    plans ||--o{ subscriptions : provisions

    quotation_templates ||--o{ quotations : formats
    quotations ||--o{ quotation_items : line_items
    quotations ||--o{ subscriptions : converts_to
    products ||--o{ quotation_items : quotes
    product_variants ||--o{ quotation_items : variant_quote

    subscriptions ||--o{ subscription_items : contains
    subscriptions ||--o{ invoices : generates
    products ||--o{ subscription_items : provisioned_product
    product_variants ||--o{ subscription_items : provisioned_variant

    invoices ||--o{ invoice_items : line_items
    invoices ||--o{ payments : settles
    invoices ||--o{ payment_allocations : allocated_against
    payments ||--o{ payment_allocations : distributes

    discounts ||--o{ discount_usage : logs_use
    invoices ||--o{ discount_usage : applied_to

    users {
        string id PK
        string email UK
        string hashed_password
        string full_name
        string phone
        string user_type
        boolean is_active
        boolean is_verified
        string avatar_url
        string google_id
        datetime last_login_at
        datetime created_at
        datetime updated_at
    }

    roles {
        int id PK
        string name UK
        string description
        datetime created_at
    }

    user_roles {
        string user_id PK,FK
        int role_id PK,FK
        datetime assigned_at
    }

    organization_members {
        string id PK
        string user_id UK,FK
        string department
        string job_title
        boolean is_lead
        json permissions
        datetime created_at
        datetime updated_at
    }

    products {
        string id PK
        string name
        string code UK
        string type
        string description
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    product_variants {
        string id PK
        string product_id FK
        string name
        string sku UK
        decimal sales_price
        decimal cost_price
        json attributes
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    plans {
        string id PK
        string name
        string code UK
        string description
        string billing_frequency
        decimal price
        int minimum_quantity
        string availability_period
        boolean is_active
        json features
        datetime created_at
        datetime updated_at
    }

    plan_products {
        string id PK
        string plan_id FK
        string product_id FK
        string variant_id FK
        boolean is_included
        int sort_order
    }

    quotation_templates {
        string id PK
        string name
        string terms_and_conditions
        int default_validity_days
        datetime created_at
        datetime updated_at
    }

    quotations {
        string id PK
        string quotation_number UK
        string customer_id FK
        string template_id FK
        string status
        decimal total_amount
        date validity_date
        string notes
        datetime created_at
        datetime updated_at
    }

    quotation_items {
        string id PK
        string quotation_id FK
        string product_id FK
        string variant_id FK
        string description
        int quantity
        decimal unit_price
        decimal total_amount
    }

    subscriptions {
        string id PK
        string subscription_code UK
        string customer_id FK
        string plan_id FK
        string quotation_id FK
        date start_date
        date expiry_date
        date next_billing_date
        string billing_cycle
        string status
        boolean auto_renew
        decimal recurring_amount
        datetime created_at
        datetime updated_at
    }

    subscription_items {
        string id PK
        string subscription_id FK
        string product_id FK
        string variant_id FK
        int quantity
        decimal unit_price
        decimal total_price
    }

    invoices {
        string id PK
        string invoice_number UK
        string subscription_id FK
        string customer_id FK
        date invoice_date
        date due_date
        decimal subtotal
        decimal tax_amount
        decimal discount_amount
        decimal total_amount
        decimal amount_paid
        string status
        string payment_method
        string notes
        datetime created_at
        datetime updated_at
    }

    invoice_items {
        string id PK
        string invoice_id FK
        string description
        int quantity
        decimal unit_price
        decimal amount
    }

    tax_rules {
        string id PK
        string name
        string tax_type
        decimal rate
        string country
        string state
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    discounts {
        string id PK
        string code UK
        string name
        string discount_type
        decimal value
        date start_date
        date end_date
        int usage_limit
        int used_count
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    discount_usage {
        string id PK
        string discount_id FK
        string customer_id FK
        string invoice_id FK
        decimal amount_discounted
        datetime used_at
    }

    payments {
        string id PK
        string payment_reference UK
        string customer_id FK
        string invoice_id FK
        decimal amount
        string payment_method
        datetime payment_date
        string status
        string gateway_transaction_id
        string notes
        datetime created_at
        datetime updated_at
    }

    payment_allocations {
        string id PK
        string payment_id FK
        string invoice_id FK
        decimal amount_allocated
        datetime allocated_at
    }
```
