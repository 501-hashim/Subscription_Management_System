from decimal import Decimal
from datetime import date, timedelta

SEED_ROLES = [
    {"name": "admin", "description": "Super administrator with unrestricted workspace privileges"},
    {"name": "staff", "description": "General Brightloop operational staff"},
    {"name": "billing_manager", "description": "Finance and collections manager"},
    {"name": "sales_rep", "description": "Commercial representative for quotation generation"},
    {"name": "customer", "description": "Registered subscriber or client account"},
]

SEED_PRODUCTS = [
    {
        "name": "Brightloop Core Suite",
        "code": "BL-CORE",
        "type": "Service / SaaS",
        "description": "All-in-one recurring revenue billing and subscription tracking platform.",
        "variants": [
            {"name": "Standard License", "sku": "BL-CORE-STD", "sales_price": Decimal("199.00"), "cost_price": Decimal("45.00"), "attributes": {"tier": "standard"}},
            {"name": "Enterprise License", "sku": "BL-CORE-ENT", "sales_price": Decimal("499.00"), "cost_price": Decimal("110.00"), "attributes": {"tier": "enterprise"}},
        ]
    },
    {
        "name": "Advanced Analytics Addon",
        "code": "BL-ANLY",
        "type": "Add-on License",
        "description": "Cohort churn analysis, MRR/ARR forecasting, and customer lifetime value metrics.",
        "variants": [
            {"name": "Real-time Cohort Sync", "sku": "BL-ANLY-RT", "sales_price": Decimal("79.00"), "cost_price": Decimal("15.00"), "attributes": {"retention_days": 365}},
        ]
    },
    {
        "name": "Dedicated API Gateway & Webhooks",
        "code": "BL-GATE",
        "type": "Infrastructure",
        "description": "High-throughput dedicated webhook delivery endpoints and event ingestion pipelines.",
        "variants": [
            {"name": "100k req/month", "sku": "BL-GATE-100K", "sales_price": Decimal("149.00"), "cost_price": Decimal("35.00"), "attributes": {"max_requests": 100000}},
            {"name": "1M req/month", "sku": "BL-GATE-1M", "sales_price": Decimal("399.00"), "cost_price": Decimal("90.00"), "attributes": {"max_requests": 1000000}},
        ]
    },
    {
        "name": "Enterprise Support & SLA",
        "code": "BL-SUPP",
        "type": "Service / SLA",
        "description": "24/7 dedicated support engineers, custom onboarding, and guaranteed response times.",
        "variants": [
            {"name": "Gold 1-hour SLA", "sku": "BL-SUPP-GOLD", "sales_price": Decimal("499.00"), "cost_price": Decimal("180.00"), "attributes": {"sla_hours": 1}},
        ]
    }
]

SEED_PLANS = [
    {
        "name": "Starter Plan",
        "code": "PLAN-STR",
        "description": "Essential recurring billing for emerging startups and digital businesses.",
        "billing_frequency": "Monthly",
        "price": Decimal("49.00"),
        "minimum_quantity": 1,
        "availability_period": "Always Available",
        "features": ["Up to 100 subscribers", "Email support", "Standard invoice templates", "1 admin seat"],
    },
    {
        "name": "Growth Professional",
        "code": "PLAN-PRO",
        "description": "Comprehensive scaling tier with automated payment recovery and webhooks.",
        "billing_frequency": "Monthly",
        "price": Decimal("179.00"),
        "minimum_quantity": 1,
        "availability_period": "Always Available",
        "features": ["Up to 2,500 subscribers", "Priority support", "Cohort churn reporting", "5 staff seats"],
    },
    {
        "name": "Growth Professional (Annual)",
        "code": "PLAN-PRO-YR",
        "description": "Annual contract with 2 months complimentary platform access.",
        "billing_frequency": "Annual",
        "price": Decimal("1790.00"),
        "minimum_quantity": 1,
        "availability_period": "Always Available",
        "features": ["2 months free", "Up to 2,500 subscribers", "Dedicated customer success lead", "Unlimited seats"],
    },
    {
        "name": "Enterprise Scale",
        "code": "PLAN-ENT",
        "description": "Dedicated infrastructure, custom SLAs, and high volume webhook pipelines.",
        "billing_frequency": "Monthly",
        "price": Decimal("499.00"),
        "minimum_quantity": 5,
        "availability_period": "Always Available",
        "features": ["Unlimited subscribers", "Dedicated API clusters", "1-hour SLA response", "Custom webhook connectors"],
    }
]

SEED_TAX_RULES = [
    {"name": "US Standard Sales Tax", "tax_type": "Percentage", "rate": Decimal("0.0825"), "country": "US", "state": "TX"},
    {"name": "EU Cross-Border Standard VAT", "tax_type": "Percentage", "rate": Decimal("0.2000"), "country": "DE", "state": None},
    {"name": "Zero-Rate Export Exemption", "tax_type": "Percentage", "rate": Decimal("0.0000"), "country": "GLOBAL", "state": None},
]

today = date.today()
SEED_DISCOUNTS = [
    {
        "code": "EARLYBIRD20",
        "name": "Early Adopter Promotion",
        "discount_type": "Percentage",
        "value": Decimal("20.00"),
        "start_date": today - timedelta(days=30),
        "end_date": today + timedelta(days=335),
        "usage_limit": 500,
    },
    {
        "code": "HACKATHON50",
        "name": "Make-A-Ton Special Credit",
        "discount_type": "Fixed",
        "value": Decimal("50.00"),
        "start_date": today - timedelta(days=10),
        "end_date": today + timedelta(days=60),
        "usage_limit": 100,
    },
    {
        "code": "ANNUALUPGRADE",
        "name": "Annual Contract Migration Incentive",
        "discount_type": "Percentage",
        "value": Decimal("15.00"),
        "start_date": today - timedelta(days=15),
        "end_date": today + timedelta(days=180),
        "usage_limit": 250,
    }
]

SEED_TEST_CUSTOMERS = [
    {
        "email": "sarah.jenkins@acmecorp.com",
        "full_name": "Sarah Jenkins",
        "phone": "+1 (555) 234-5678",
        "company": "Acme Corporation",
    },
    {
        "email": "d.chen@apexlogistics.io",
        "full_name": "David Chen",
        "phone": "+1 (555) 345-6789",
        "company": "Apex Global Logistics",
    },
    {
        "email": "elena@novatech.de",
        "full_name": "Elena Rostova",
        "phone": "+49 30 123456",
        "company": "NovaTech Solutions",
    }
]
