-- Seed data for Brightloop Subscription Management System
-- Reusing all teammate mockData records

-- Customers
INSERT INTO customers (id, name, email, company, phone, address, status, total_subscriptions, joined_date)
VALUES
  ('CUST-001', 'Sarah Jenkins', 'sarah.jenkins@acmecorp.com', 'Acme Corporation', '+1 (555) 234-5678', '742 Evergreen Terrace, Springfield, OR', 'Active', 3, '2025-03-15'),
  ('CUST-002', 'David Chen', 'd.chen@apexlogistics.io', 'Apex Global Logistics', '+1 (555) 345-6789', '100 Market St, Suite 400, San Francisco, CA', 'Active', 1, '2025-06-20'),
  ('CUST-003', 'Elena Rostova', 'elena@novatech.de', 'NovaTech Solutions', '+49 30 123456', 'Friedrichstraße 44, Berlin, Germany', 'Active', 4, '2024-11-01'),
  ('CUST-004', 'Marcus Brody', 'm.brody@solardrive.com', 'SolarDrive Energy', '+1 (555) 456-7890', '1200 Energy Way, Austin, TX', 'Active', 2, '2025-01-10'),
  ('CUST-005', 'Amina Al-Mansoor', 'amina@khalifa-retail.ae', 'Al-Mansoor Retail Group', '+971 4 9876543', 'Sheikh Zayed Rd, Dubai, UAE', 'Inactive', 0, '2024-08-14'),
  ('CUST-006', 'Liam O''Connor', 'liam@celticcloud.ie', 'Celtic Cloud Ltd', '+353 1 234 5678', 'Grand Canal Dock, Dublin, Ireland', 'Active', 1, '2025-04-02'),
  ('CUST-007', 'Priya Sharma', 'priya@infoway-digital.in', 'Infoway Digital Services', '+91 80 2345 6789', 'Whitefield Tech Park, Bangalore, India', 'Active', 2, '2025-02-18')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO products (id, name, code, type, sales_price, cost_price, variants, status, description, image_url, features)
VALUES
  ('PROD-001', 'Brightloop Core Suite', 'BL-CORE', 'Service / SaaS', 199.00, 45.00, 
   '["Monthly", "Annual", "Enterprise"]'::jsonb, 
   'Available', 
   'All-in-one recurring revenue billing, customer lifecycle tracking, and subscription contract orchestration platform.',
   'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60',
   '["Automated recurring billing", "Multi-currency invoicing", "Smart dunning recovery", "Audit ledger & reporting"]'::jsonb),

  ('PROD-002', 'Advanced Analytics Addon', 'BL-ANLY', 'Add-on License', 79.00, 15.00, 
   '["Standard Addon", "Pro Real-time Addon"]'::jsonb, 
   'Available', 
   'Cohort churn analysis, MRR/ARR real-time forecasting, and predictive customer lifetime value (LTV) reporting.',
   'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
   '["Cohort churn visualization", "MRR & ARR forecasting", "Executive dashboards", "Automated weekly CSV digest"]'::jsonb),

  ('PROD-003', 'Dedicated API Gateway & Webhooks', 'BL-GATE', 'Infrastructure', 149.00, 35.00, 
   '["100k req/mo", "1M req/mo", "10M req/mo"]'::jsonb, 
   'Available', 
   'High throughput dedicated webhook delivery endpoints, guaranteed zero message loss, and event streaming pipelines.',
   'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
   '["99.99% webhook delivery SLA", "Event retry idempotency", "Custom signed HMAC headers", "Payload replay console"]'::jsonb),

  ('PROD-004', 'Enterprise Support & SLA', 'BL-SUPP', 'Service / SLA', 499.00, 180.00, 
   '["Silver (4hr SLA)", "Gold (1hr SLA)"]'::jsonb, 
   'Available', 
   '24/7 dedicated support engineers, custom onboarding architects, and guaranteed response time escalation matrix.',
   'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
   '["1-hour response SLA", "Named Technical Account Manager", "Custom data migration support", "Quarterly business review"]'::jsonb),

  ('PROD-005', 'Legacy Sync Connector v1', 'BL-LEG-SYNC', 'Integration', 49.00, 10.00, 
   '["Single Node"]'::jsonb, 
   'Archived', 
   'Older batch synchronization daemon for legacy accounting databases. Replaced by Core Suite v2.',
   'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60',
   '["Batch database sync", "Legacy ERP format adapter"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Subscription Plans
INSERT INTO subscription_plans (id, product_id, name, code, price, billing_frequency, renewal_price, minimum_quantity, auto_renewal_supported, features, status)
VALUES
  ('PLAN-001', 'PROD-001', 'Starter Plan', 'PLAN-STR', 49.00, 'Monthly', 49.00, 1, true,
   '["Up to 1,000 active subscriptions", "Basic automated dunning", "Standard payment webhooks", "Email support within 24 hours", "Daily cycle billing reconciliation"]'::jsonb,
   'Active'),

  ('PLAN-002', 'PROD-001', 'Growth Professional', 'PLAN-PRO', 179.00, 'Monthly', 179.00, 5, true,
   '["Up to 25,000 active subscriptions", "Multi-currency automated invoicing", "Smart dunning retry logic for churn prevention", "Priority Slack & email support within 2 hours", "Custom branding on customer invoices and receipts", "Includes Advanced Analytics module"]'::jsonb,
   'Active'),

  ('PLAN-003', 'PROD-001', 'Enterprise Scale', 'PLAN-ENT', 499.00, 'Monthly', 499.00, 20, true,
   '["Unlimited active subscriptions & customers", "Dedicated Technical Account Executive", "Custom SLA & 99.99% guaranteed uptime", "Advanced cohort churn & ARR forecasting", "Unlimited custom webhook delivery pipelines", "Custom contract terms & payment terms"]'::jsonb,
   'Active'),

  ('PLAN-004', 'PROD-002', 'Analytics Addon - Standard', 'PLAN-ANLY-STD', 79.00, 'Monthly', 79.00, 1, true,
   '["Full MRR / ARR tracking", "Monthly churn breakdown", "CSV / Excel export"]'::jsonb,
   'Active'),

  ('PLAN-005', 'PROD-003', 'Dedicated Gateway - 1M Events', 'PLAN-GATE-1M', 149.00, 'Monthly', 149.00, 1, true,
   '["1,000,000 webhook events/month", "Sub-100ms delivery latency", "Automated retry logs"]'::jsonb,
   'Active')
ON CONFLICT (id) DO NOTHING;

-- Subscriptions
INSERT INTO subscriptions (id, customer_id, product_id, plan_id, plan_name, start_date, expiry_date, billing_cycle, amount, status, next_billing_date, auto_renew, quantity)
VALUES
  ('SUB-8401', 'CUST-001', 'PROD-001', 'PLAN-002', 'Growth Professional', '2025-03-15', '2026-03-15', 'Annual', 1790.00, 'Active', '2026-03-15', true, 1),
  ('SUB-8402', 'CUST-001', 'PROD-002', 'PLAN-004', 'Advanced Analytics Addon', '2025-05-01', '2026-05-01', 'Monthly', 79.00, 'Active', '2026-11-01', true, 1),
  ('SUB-8403', 'CUST-001', 'PROD-003', 'PLAN-005', 'Dedicated API Gateway & Webhooks', '2025-06-01', '2026-11-08', 'Monthly', 149.00, 'Expiring Soon', '2026-11-08', false, 1),
  ('SUB-8404', 'CUST-002', 'PROD-001', 'PLAN-001', 'Starter Plan', '2025-06-20', '2026-06-20', 'Monthly', 49.00, 'Active', '2026-11-20', true, 1),
  ('SUB-8405', 'CUST-003', 'PROD-001', 'PLAN-003', 'Enterprise Scale', '2024-11-01', '2026-11-01', 'Annual', 4990.00, 'Expiring Soon', '2026-11-01', true, 1),
  ('SUB-8406', 'CUST-004', 'PROD-001', 'PLAN-002', 'Growth Professional', '2025-01-10', '2026-01-10', 'Annual', 1790.00, 'Active', '2026-01-10', true, 1),
  ('SUB-8407', 'CUST-004', 'PROD-002', 'PLAN-004', 'Advanced Analytics Addon', '2025-04-12', '2025-10-12', 'Monthly', 79.00, 'Expired', '2025-10-12', false, 1)
ON CONFLICT (id) DO NOTHING;

-- Invoices
INSERT INTO invoices (id, customer_id, subscription_id, invoice_date, due_date, amount, status, payment_method, items)
VALUES
  ('INV-2025-1081', 'CUST-001', 'SUB-8401', '2025-10-01', '2025-10-15', 1790.00, 'Paid', 'Credit Card (Visa)',
   '[{"desc": "Growth Professional Annual Subscription Plan", "qty": 1, "unit": 1790.00, "total": 1790.00}]'::jsonb),

  ('INV-2025-1082', 'CUST-001', 'SUB-8402', '2025-10-01', '2025-10-15', 79.00, 'Paid', 'Credit Card (Visa)',
   '[{"desc": "Advanced Analytics Addon Monthly Cycle", "qty": 1, "unit": 79.00, "total": 79.00}]'::jsonb),

  ('INV-2025-1083', 'CUST-001', 'SUB-8403', '2025-10-25', '2025-11-08', 149.00, 'Pending', 'Credit Card (Visa)',
   '[{"desc": "Dedicated API Gateway & Webhooks Renewal", "qty": 1, "unit": 149.00, "total": 149.00}]'::jsonb),

  ('INV-2025-1084', 'CUST-002', 'SUB-8404', '2025-10-10', '2025-10-25', 49.00, 'Paid', 'ACH Transfer',
   '[{"desc": "Starter Plan Monthly Cycle", "qty": 1, "unit": 49.00, "total": 49.00}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Payments
INSERT INTO payments (id, customer_id, subscription_id, invoice_number, product_name, plan_name, amount, payment_date, payment_method, status, transaction_ref)
VALUES
  ('PAY-7710', 'CUST-001', 'SUB-8401', 'INV-2025-1081', 'Brightloop Core Suite', 'Growth Professional', 1790.00, '2025-10-01 10:14:00', 'Credit Card (Visa)', 'Completed', 'tx_card_visa_89410a8'),
  ('PAY-7711', 'CUST-001', 'SUB-8402', 'INV-2025-1082', 'Advanced Analytics Addon', 'Analytics Addon - Standard', 79.00, '2025-10-01 10:15:00', 'Credit Card (Visa)', 'Completed', 'tx_card_visa_89410b2'),
  ('PAY-7712', 'CUST-002', 'SUB-8404', 'INV-2025-1084', 'Brightloop Core Suite', 'Starter Plan', 49.00, '2025-10-10 14:22:00', 'ACH Transfer', 'Completed', 'tx_ach_7718cc910a')
ON CONFLICT (id) DO NOTHING;

-- Notifications
INSERT INTO notifications (id, customer_id, title, message, type, read, created_at)
VALUES
  ('NOTIF-001', 'CUST-001', 'Subscription Cycle Activated', 'Your Growth Professional subscription is active with auto-renewal enabled.', 'purchase', false, CURRENT_TIMESTAMP - INTERVAL '2 days'),
  ('NOTIF-002', 'CUST-001', 'Renewal Notice: Dedicated API Gateway', 'Subscription SUB-8403 expires in 8 days. Click to review renewal options.', 'expiry', false, CURRENT_TIMESTAMP - INTERVAL '1 day'),
  ('NOTIF-003', 'CUST-001', 'Payment Settled: $79.00', 'Payment transaction PAY-7711 for Analytics Addon was completed successfully.', 'payment', true, CURRENT_TIMESTAMP - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;
