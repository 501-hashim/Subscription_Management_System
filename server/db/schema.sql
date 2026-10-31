-- Brightloop Subscription Management System
-- PostgreSQL Relational Database Schema

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  total_subscriptions INT DEFAULT 0,
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (Created & Published by Admin)
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  sales_price NUMERIC(10, 2) NOT NULL,
  cost_price NUMERIC(10, 2) DEFAULT 0,
  variants JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'Available',
  description TEXT,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Subscription Plans Table (Tiers linked to products or global tiers)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  billing_frequency VARCHAR(50) DEFAULT 'Monthly', -- Monthly, Quarterly, Annual
  renewal_price NUMERIC(10, 2),
  minimum_quantity INT DEFAULT 1,
  auto_renewal_supported BOOLEAN DEFAULT true,
  features JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id VARCHAR(50) REFERENCES products(id) ON DELETE SET NULL,
  plan_id VARCHAR(50) REFERENCES subscription_plans(id) ON DELETE SET NULL,
  plan_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  billing_cycle VARCHAR(50) DEFAULT 'Monthly',
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active', -- Active, Expiring Soon, Expired, Cancelled, Payment Pending
  next_billing_date DATE,
  auto_renew BOOLEAN DEFAULT true,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id VARCHAR(50) REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50),
  product_name VARCHAR(255),
  plan_name VARCHAR(255),
  amount NUMERIC(10, 2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  payment_method VARCHAR(100) DEFAULT 'Credit Card (Sandbox)',
  status VARCHAR(50) DEFAULT 'Completed', -- Completed, Pending, Failed, Refunded
  transaction_ref VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id VARCHAR(50) REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE DEFAULT CURRENT_DATE,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Paid', -- Paid, Pending, Overdue
  payment_method VARCHAR(100) DEFAULT 'Credit Card',
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  customer_id VARCHAR(50) NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- purchase, payment, renewal, expiry, cancellation
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON subscriptions(expiry_date);
CREATE INDEX IF NOT EXISTS idx_payments_customer ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_customer ON notifications(customer_id, read);
CREATE INDEX IF NOT EXISTS idx_plans_product ON subscription_plans(product_id);
