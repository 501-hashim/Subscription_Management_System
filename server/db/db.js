import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// PostgreSQL Connection Pool Config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/subscription_db',
  connectionTimeoutMillis: 2000,
});

let isPostgresConnected = false;

// In-Memory Relational Fallback Store (Pre-loaded with exact seed data)
const memoryStore = {
  customers: [
    { id: 'CUST-001', name: 'Sarah Jenkins', email: 'sarah.jenkins@acmecorp.com', company: 'Acme Corporation', phone: '+1 (555) 234-5678', address: '742 Evergreen Terrace, Springfield, OR', status: 'Active', total_subscriptions: 3, joined_date: '2025-03-15' },
    { id: 'CUST-002', name: 'David Chen', email: 'd.chen@apexlogistics.io', company: 'Apex Global Logistics', phone: '+1 (555) 345-6789', address: '100 Market St, Suite 400, San Francisco, CA', status: 'Active', total_subscriptions: 1, joined_date: '2025-06-20' },
    { id: 'CUST-003', name: 'Elena Rostova', email: 'elena@novatech.de', company: 'NovaTech Solutions', phone: '+49 30 123456', address: 'Friedrichstraße 44, Berlin, Germany', status: 'Active', total_subscriptions: 4, joined_date: '2024-11-01' },
    { id: 'CUST-004', name: 'Marcus Brody', email: 'm.brody@solardrive.com', company: 'SolarDrive Energy', phone: '+1 (555) 456-7890', address: '1200 Energy Way, Austin, TX', status: 'Active', total_subscriptions: 2, joined_date: '2025-01-10' },
    { id: 'CUST-005', name: 'Amina Al-Mansoor', email: 'amina@khalifa-retail.ae', company: 'Al-Mansoor Retail Group', phone: '+971 4 9876543', address: 'Sheikh Zayed Rd, Dubai, UAE', status: 'Inactive', total_subscriptions: 0, joined_date: '2024-08-14' },
    { id: 'CUST-006', name: 'Liam O\'Connor', email: 'liam@celticcloud.ie', company: 'Celtic Cloud Ltd', phone: '+353 1 234 5678', address: 'Grand Canal Dock, Dublin, Ireland', status: 'Active', total_subscriptions: 1, joined_date: '2025-04-02' },
    { id: 'CUST-007', name: 'Priya Sharma', email: 'priya@infoway-digital.in', company: 'Infoway Digital Services', phone: '+91 80 2345 6789', address: 'Whitefield Tech Park, Bangalore, India', status: 'Active', total_subscriptions: 2, joined_date: '2025-02-18' },
  ],
  products: [
    {
      id: 'PROD-001',
      name: 'CRM Software',
      code: 'BL-CRM',
      type: 'CRM Software',
      category: 'CRM Software',
      sales_price: 199.00,
      cost_price: 45.00,
      variants: ['Starter CRM', 'Professional CRM', 'Enterprise CRM'],
      status: 'Available',
      badge: 'Top Rated CRM',
      rating: '98% Match',
      description: 'Comprehensive Customer Relationship Management (CRM) platform with visual sales pipelines, lead nurturing, customer tracking, and team collaboration.',
      image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
      features: ['Visual Sales Pipeline', 'Automated Lead Capture', 'Customer 360° Activity History', 'Email & Calendar Integration', 'Deal Forecast Analytics']
    },
    {
      id: 'PROD-002',
      name: 'Accounting Software',
      code: 'BL-ACCT',
      type: 'Accounting Software',
      category: 'Accounting Software',
      sales_price: 149.00,
      cost_price: 30.00,
      variants: ['Standard Ledger', 'Multi-Entity Pro', 'Auditor Edition'],
      status: 'Available',
      badge: 'Tax & Invoicing',
      rating: '97% Match',
      description: 'Automated corporate accounting, statutory VAT/tax compliance, automated expense tracking, balance sheets, and real-time P&L reporting.',
      image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80',
      features: ['Automated VAT / Tax & Invoicing Engine', 'Real-time Balance Sheet & P&L Statements', 'Multi-Currency Bank Reconciliation', 'Expense Categorization & Audit Trail', 'Statutory Tax Compliance Reports']
    },
    {
      id: 'PROD-003',
      name: 'Cloud Storage',
      code: 'BL-STOR',
      type: 'Cloud Storage',
      category: 'Cloud Storage',
      sales_price: 79.00,
      cost_price: 18.00,
      variants: ['1 TB Secure', '10 TB Team Cloud', 'Unlimited S3 Enterprise'],
      status: 'Available',
      badge: 'Encrypted NVMe',
      rating: '99% Match',
      description: 'Ultra-secure encrypted cloud storage with automated backup snapshots, geo-redundant distribution, instant file sync, and 99.999% durability.',
      image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80',
      features: ['End-to-End AES-256 Data Encryption', 'Multi-Region Geo-Redundant Replication', 'High-Throughput S3 REST API', 'Automated Daily Snapshot Backups', '99.999% Durability SLA']
    }
  ],
  subscription_plans: [
    {
      id: 'PLAN-001',
      product_id: 'PROD-001',
      name: 'Starter CRM Plan',
      code: 'PLAN-CRM-STR',
      price: 49.00,
      billing_frequency: 'Monthly',
      renewal_price: 49.00,
      minimum_quantity: 1,
      auto_renewal_supported: true,
      features: ['Up to 1,000 active leads', 'Visual sales pipeline', 'Email integration', 'Standard lead capture forms', 'Daily sync'],
      status: 'Active'
    },
    {
      id: 'PLAN-002',
      product_id: 'PROD-001',
      name: 'Professional CRM',
      code: 'PLAN-CRM-PRO',
      price: 199.00,
      billing_frequency: 'Monthly',
      renewal_price: 199.00,
      minimum_quantity: 1,
      auto_renewal_supported: true,
      features: ['Up to 25,000 active contacts', 'Automated lead nurturing sequences', 'Multi-pipeline deal stages', 'Priority email & chat support', 'Deal forecast analytics'],
      status: 'Active'
    },
    {
      id: 'PLAN-003',
      product_id: 'PROD-001',
      name: 'Enterprise Scale CRM',
      code: 'PLAN-CRM-ENT',
      price: 499.00,
      billing_frequency: 'Monthly',
      renewal_price: 499.00,
      minimum_quantity: 5,
      auto_renewal_supported: true,
      features: ['Unlimited contacts & pipelines', 'Dedicated Account Executive', 'Custom REST API integrations', 'Advanced cohort churn forecasting', '99.99% SLA'],
      status: 'Active'
    },
    {
      id: 'PLAN-004',
      product_id: 'PROD-002',
      name: 'Standard Ledger',
      code: 'PLAN-ACCT-STD',
      price: 99.00,
      billing_frequency: 'Monthly',
      renewal_price: 99.00,
      minimum_quantity: 1,
      auto_renewal_supported: true,
      features: ['Automated corporate accounting', 'Statutory tax & expense logs', 'Single-entity P&L statements', 'Receipt attachment OCR'],
      status: 'Active'
    },
    {
      id: 'PLAN-005',
      product_id: 'PROD-002',
      name: 'Tax & Invoicing Pro',
      code: 'PLAN-ACCT-PRO',
      price: 149.00,
      billing_frequency: 'Monthly',
      renewal_price: 149.00,
      minimum_quantity: 1,
      auto_renewal_supported: true,
      features: ['Automated statutory VAT / Tax engine', 'Real-time balance sheet & P&L', 'Multi-currency bank feeds', 'Automated recurring invoice generation'],
      status: 'Active'
    },
    {
      id: 'PLAN-006',
      product_id: 'PROD-003',
      name: '10 TB Team Cloud Storage',
      code: 'PLAN-STOR-10TB',
      price: 79.00,
      billing_frequency: 'Monthly',
      renewal_price: 79.00,
      minimum_quantity: 1,
      auto_renewal_supported: true,
      features: ['10 TB encrypted NVMe storage', 'AES-256 data encryption at rest', 'Multi-region geo replication', 'High-throughput S3 REST API', '99.999% durability SLA'],
      status: 'Active'
    }
  ],
  subscriptions: [
    { id: 'SUB-8401', customer_id: 'CUST-001', product_id: 'PROD-001', plan_id: 'PLAN-002', plan_name: 'Growth Professional', start_date: '2025-03-15', expiry_date: '2026-03-15', billing_cycle: 'Annual', amount: 1790.00, status: 'Active', next_billing_date: '2026-03-15', auto_renew: true, quantity: 1 },
    { id: 'SUB-8402', customer_id: 'CUST-001', product_id: 'PROD-002', plan_id: 'PLAN-004', plan_name: 'Advanced Analytics Addon', start_date: '2025-05-01', expiry_date: '2026-05-01', billing_cycle: 'Monthly', amount: 79.00, status: 'Active', next_billing_date: '2026-11-01', auto_renew: true, quantity: 1 },
    { id: 'SUB-8403', customer_id: 'CUST-001', product_id: 'PROD-003', plan_id: 'PLAN-005', plan_name: 'Dedicated API Gateway & Webhooks', start_date: '2025-06-01', expiry_date: '2026-11-08', billing_cycle: 'Monthly', amount: 149.00, status: 'Expiring Soon', next_billing_date: '2026-11-08', auto_renew: false, quantity: 1 },
    { id: 'SUB-8404', customer_id: 'CUST-002', product_id: 'PROD-001', plan_id: 'PLAN-001', plan_name: 'Starter Plan', start_date: '2025-06-20', expiry_date: '2026-06-20', billing_cycle: 'Monthly', amount: 49.00, status: 'Active', next_billing_date: '2026-11-20', auto_renew: true, quantity: 1 },
    { id: 'SUB-8405', customer_id: 'CUST-003', product_id: 'PROD-001', plan_id: 'PLAN-003', plan_name: 'Enterprise Scale', start_date: '2024-11-01', expiry_date: '2026-11-01', billing_cycle: 'Annual', amount: 4990.00, status: 'Expiring Soon', next_billing_date: '2026-11-01', auto_renew: true, quantity: 1 },
    { id: 'SUB-8406', customer_id: 'CUST-004', product_id: 'PROD-001', plan_id: 'PLAN-002', plan_name: 'Growth Professional', start_date: '2025-01-10', expiry_date: '2026-01-10', billing_cycle: 'Annual', amount: 1790.00, status: 'Active', next_billing_date: '2026-01-10', auto_renew: true, quantity: 1 },
    { id: 'SUB-8407', customer_id: 'CUST-004', product_id: 'PROD-002', plan_id: 'PLAN-004', plan_name: 'Advanced Analytics Addon', start_date: '2025-04-12', expiry_date: '2025-10-12', billing_cycle: 'Monthly', amount: 79.00, status: 'Expired', next_billing_date: '2025-10-12', auto_renew: false, quantity: 1 }
  ],
  payments: [
    { id: 'PAY-7710', customer_id: 'CUST-001', subscription_id: 'SUB-8401', invoice_number: 'INV-2025-1081', product_name: 'Brightloop Core Suite', plan_name: 'Growth Professional', amount: 1790.00, payment_date: '2025-10-01 10:14:00', payment_method: 'Credit Card (Visa)', status: 'Completed', transaction_ref: 'tx_card_visa_89410a8' },
    { id: 'PAY-7711', customer_id: 'CUST-001', subscription_id: 'SUB-8402', invoice_number: 'INV-2025-1082', product_name: 'Advanced Analytics Addon', plan_name: 'Analytics Addon - Standard', amount: 79.00, payment_date: '2025-10-01 10:15:00', payment_method: 'Credit Card (Visa)', status: 'Completed', transaction_ref: 'tx_card_visa_89410b2' },
    { id: 'PAY-7712', customer_id: 'CUST-002', subscription_id: 'SUB-8404', invoice_number: 'INV-2025-1084', product_name: 'Brightloop Core Suite', plan_name: 'Starter Plan', amount: 49.00, payment_date: '2025-10-10 14:22:00', payment_method: 'ACH Transfer', status: 'Completed', transaction_ref: 'tx_ach_7718cc910a' }
  ],
  invoices: [
    {
      id: 'INV-2025-1081',
      customer_id: 'CUST-001',
      subscription_id: 'SUB-8401',
      invoice_date: '2025-10-01',
      due_date: '2025-10-15',
      amount: 1790.00,
      status: 'Paid',
      payment_method: 'Credit Card (Visa)',
      items: [{ desc: 'Growth Professional Annual Subscription Plan', qty: 1, unit: 1790.00, total: 1790.00 }]
    },
    {
      id: 'INV-2025-1082',
      customer_id: 'CUST-001',
      subscription_id: 'SUB-8402',
      invoice_date: '2025-10-01',
      due_date: '2025-10-15',
      amount: 79.00,
      status: 'Paid',
      payment_method: 'Credit Card (Visa)',
      items: [{ desc: 'Advanced Analytics Addon Monthly Cycle', qty: 1, unit: 79.00, total: 79.00 }]
    },
    {
      id: 'INV-2025-1083',
      customer_id: 'CUST-001',
      subscription_id: 'SUB-8403',
      invoice_date: '2025-10-25',
      due_date: '2025-11-08',
      amount: 149.00,
      status: 'Pending',
      payment_method: 'Credit Card (Visa)',
      items: [{ desc: 'Dedicated API Gateway & Webhooks Renewal', qty: 1, unit: 149.00, total: 149.00 }]
    },
    {
      id: 'INV-2025-1084',
      customer_id: 'CUST-002',
      subscription_id: 'SUB-8404',
      invoice_date: '2025-10-10',
      due_date: '2025-10-25',
      amount: 49.00,
      status: 'Paid',
      payment_method: 'ACH Transfer',
      items: [{ desc: 'Starter Plan Monthly Cycle', qty: 1, unit: 49.00, total: 49.00 }]
    }
  ],
  notifications: [
    {
      id: 'NOTIF-001',
      customer_id: 'CUST-001',
      title: 'Subscription Cycle Activated',
      message: 'Your Growth Professional subscription is active with auto-renewal enabled.',
      type: 'purchase',
      read: false,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'NOTIF-002',
      customer_id: 'CUST-001',
      title: 'Renewal Notice: Dedicated API Gateway',
      message: 'Subscription SUB-8403 expires in 8 days. Click to review renewal options.',
      type: 'expiry',
      read: false,
      created_at: new Date(Date.now() - 1 * 86400000).toISOString()
    },
    {
      id: 'NOTIF-003',
      customer_id: 'CUST-001',
      title: 'Payment Settled: $79.00',
      message: 'Payment transaction PAY-7711 for Analytics Addon was completed successfully.',
      type: 'payment',
      read: true,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ]
};

// Initialize DB schema and check PostgreSQL connectivity
export async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('[PostgreSQL] Successfully connected to PostgreSQL server.');
    isPostgresConnected = true;

    // Run schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('[PostgreSQL] Database schema tables verified.');

    // Run seed
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await client.query(seedSql);
    console.log('[PostgreSQL] Seed data loaded into PostgreSQL.');

    client.release();
  } catch (err) {
    console.warn('[PostgreSQL] Notice: Could not connect to local PostgreSQL daemon (' + err.message + ').');
    console.log('[Database] Active fallback: Initialized embedded relational store with all teammate records.');
    isPostgresConnected = false;
  }
}

// Database query interface supporting both PostgreSQL and memory store
export const db = {
  isPostgres: () => isPostgresConnected,
  getStore: () => memoryStore,

  // Generic query runner for PostgreSQL when active
  async query(text, params = []) {
    if (isPostgresConnected) {
      return pool.query(text, params);
    }
    throw new Error('PostgreSQL not connected; use specialized store helpers');
  },

  // Customers
  async getCustomerById(id) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
      return res.rows[0];
    }
    return memoryStore.customers.find((c) => c.id === id);
  },

  async updateCustomer(id, { name, phone, address }) {
    if (isPostgresConnected) {
      const res = await pool.query(
        'UPDATE customers SET name = COALESCE($1, name), phone = COALESCE($2, phone), address = COALESCE($3, address), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [name, phone, address, id]
      );
      return res.rows[0];
    }
    const cust = memoryStore.customers.find((c) => c.id === id);
    if (cust) {
      if (name) cust.name = name;
      if (phone) cust.phone = phone;
      if (address) cust.address = address;
    }
    return cust;
  },

  // Products
  async getProducts({ search = '', category = 'All', sort = 'price_asc' } = {}) {
    if (isPostgresConnected) {
      let query = "SELECT * FROM products WHERE status = 'Available'";
      const params = [];
      let paramIndex = 1;

      if (category && category !== 'All') {
        query += ` AND type = $${paramIndex++}`;
        params.push(category);
      }

      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      if (sort === 'price_asc') query += ' ORDER BY sales_price ASC';
      else if (sort === 'price_desc') query += ' ORDER BY sales_price DESC';
      else if (sort === 'name') query += ' ORDER BY name ASC';

      const res = await pool.query(query, params);
      return res.rows;
    }

    let list = memoryStore.products.filter((p) => p.status === 'Available');
    if (category && category !== 'All') {
      list = list.filter((p) => p.type === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (sort === 'price_asc') {
      list.sort((a, b) => a.sales_price - b.sales_price);
    } else if (sort === 'price_desc') {
      list.sort((a, b) => b.sales_price - a.sales_price);
    } else if (sort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  },

  async getProductById(id) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      const product = res.rows[0];
      if (!product) return null;

      const plansRes = await pool.query('SELECT * FROM subscription_plans WHERE product_id = $1 AND status = $2', [id, 'Active']);
      return { ...product, plans: plansRes.rows };
    }

    const prod = memoryStore.products.find((p) => p.id === id);
    if (!prod) return null;
    const plans = memoryStore.subscription_plans.filter((plan) => plan.product_id === id && plan.status === 'Active');
    return { ...prod, plans };
  },

  // Subscription Plans
  async getPlanById(planId) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM subscription_plans WHERE id = $1', [planId]);
      return res.rows[0];
    }
    return memoryStore.subscription_plans.find((p) => p.id === planId);
  },

  // Subscriptions
  async getSubscriptionsByCustomer(customerId) {
    if (isPostgresConnected) {
      const res = await pool.query(
        'SELECT s.*, p.name as product_name, p.image_url as product_image FROM subscriptions s LEFT JOIN products p ON s.product_id = p.id WHERE s.customer_id = $1 ORDER BY s.created_at DESC',
        [customerId]
      );
      return res.rows;
    }
    return memoryStore.subscriptions
      .filter((s) => s.customer_id === customerId)
      .map((s) => {
        const prod = memoryStore.products.find((p) => p.id === s.product_id);
        return {
          ...s,
          product_name: prod?.name || s.plan_name,
          product_image: prod?.image_url || '',
        };
      })
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  },

  async getSubscriptionById(subId, customerId) {
    if (isPostgresConnected) {
      const res = await pool.query(
        'SELECT s.*, p.name as product_name, p.image_url as product_image FROM subscriptions s LEFT JOIN products p ON s.product_id = p.id WHERE s.id = $1 AND s.customer_id = $2',
        [subId, customerId]
      );
      return res.rows[0];
    }
    const sub = memoryStore.subscriptions.find((s) => s.id === subId && s.customer_id === customerId);
    if (!sub) return null;
    const prod = memoryStore.products.find((p) => p.id === sub.product_id);
    return {
      ...sub,
      product_name: prod?.name || sub.plan_name,
      product_image: prod?.image_url || '',
    };
  },

  async createSubscription({ customer_id, product_id, plan_id, plan_name, start_date, expiry_date, billing_cycle, amount, auto_renew, quantity = 1 }) {
    const id = `SUB-${Math.floor(8500 + Math.random() * 1000)}`;
    const newSub = {
      id,
      customer_id,
      product_id,
      plan_id,
      plan_name,
      start_date,
      expiry_date,
      billing_cycle,
      amount,
      status: 'Active',
      next_billing_date: expiry_date,
      auto_renew: auto_renew ?? true,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isPostgresConnected) {
      const res = await pool.query(
        `INSERT INTO subscriptions (id, customer_id, product_id, plan_id, plan_name, start_date, expiry_date, billing_cycle, amount, status, next_billing_date, auto_renew, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [id, customer_id, product_id, plan_id, plan_name, start_date, expiry_date, billing_cycle, amount, 'Active', expiry_date, auto_renew ?? true, quantity]
      );
      // Increment customer's total subscriptions
      await pool.query('UPDATE customers SET total_subscriptions = total_subscriptions + 1 WHERE id = $1', [customer_id]);
      return res.rows[0];
    }

    memoryStore.subscriptions.unshift(newSub);
    const cust = memoryStore.customers.find((c) => c.id === customer_id);
    if (cust) cust.total_subscriptions = (cust.total_subscriptions || 0) + 1;
    return newSub;
  },

  async updateSubscription(subId, customerId, updates) {
    if (isPostgresConnected) {
      const fields = [];
      const values = [];
      let idx = 1;

      for (const [key, val] of Object.entries(updates)) {
        fields.push(`${key} = $${idx++}`);
        values.push(val);
      }
      values.push(subId, customerId);

      const query = `UPDATE subscriptions SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx++} AND customer_id = $${idx} RETURNING *`;
      const res = await pool.query(query, values);
      return res.rows[0];
    }

    const sub = memoryStore.subscriptions.find((s) => s.id === subId && s.customer_id === customerId);
    if (sub) {
      Object.assign(sub, updates, { updated_at: new Date().toISOString() });
    }
    return sub;
  },

  // Payments
  async createPayment({ customer_id, subscription_id, invoice_number, product_name, plan_name, amount, payment_method, status = 'Completed', transaction_ref }) {
    const id = `PAY-${Math.floor(7750 + Math.random() * 500)}`;
    const txRef = transaction_ref || `tx_${Math.random().toString(36).substring(2, 11)}`;
    const payment = {
      id,
      customer_id,
      subscription_id,
      invoice_number,
      product_name,
      plan_name,
      amount,
      payment_date: new Date().toISOString(),
      payment_method: payment_method || 'Credit Card (Sandbox)',
      status,
      transaction_ref: txRef,
      created_at: new Date().toISOString(),
    };

    if (isPostgresConnected) {
      const res = await pool.query(
        `INSERT INTO payments (id, customer_id, subscription_id, invoice_number, product_name, plan_name, amount, payment_date, payment_method, status, transaction_ref)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [id, customer_id, subscription_id, invoice_number, product_name, plan_name, amount, new Date(), payment_method || 'Credit Card', status, txRef]
      );
      return res.rows[0];
    }

    memoryStore.payments.unshift(payment);
    return payment;
  },

  async getPaymentsByCustomer(customerId) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM payments WHERE customer_id = $1 ORDER BY payment_date DESC', [customerId]);
      return res.rows;
    }
    return memoryStore.payments
      .filter((p) => p.customer_id === customerId)
      .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
  },

  // Invoices
  async createInvoice({ customer_id, subscription_id, invoice_date, due_date, amount, status = 'Paid', payment_method, items = [] }) {
    const id = `INV-2025-${Math.floor(1100 + Math.random() * 200)}`;
    const invoice = {
      id,
      customer_id,
      subscription_id,
      invoice_date: invoice_date || new Date().toISOString().split('T')[0],
      due_date: due_date || new Date().toISOString().split('T')[0],
      amount,
      status,
      payment_method: payment_method || 'Credit Card',
      items,
      created_at: new Date().toISOString(),
    };

    if (isPostgresConnected) {
      const res = await pool.query(
        `INSERT INTO invoices (id, customer_id, subscription_id, invoice_date, due_date, amount, status, payment_method, items)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [id, customer_id, subscription_id, invoice.invoice_date, invoice.due_date, amount, status, payment_method, JSON.stringify(items)]
      );
      return res.rows[0];
    }

    memoryStore.invoices.unshift(invoice);
    return invoice;
  },

  async getInvoicesByCustomer(customerId) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM invoices WHERE customer_id = $1 ORDER BY invoice_date DESC', [customerId]);
      return res.rows;
    }
    return memoryStore.invoices
      .filter((i) => i.customer_id === customerId)
      .sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));
  },

  async getInvoiceById(invoiceId, customerId) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM invoices WHERE id = $1 AND customer_id = $2', [invoiceId, customerId]);
      return res.rows[0];
    }
    return memoryStore.invoices.find((i) => i.id === invoiceId && i.customer_id === customerId);
  },

  // Notifications
  async createNotification({ customer_id, title, message, type = 'info' }) {
    const id = `NOTIF-${Math.floor(100 + Math.random() * 900)}`;
    const notification = {
      id,
      customer_id,
      title,
      message,
      type,
      read: false,
      created_at: new Date().toISOString(),
    };

    if (isPostgresConnected) {
      const res = await pool.query(
        'INSERT INTO notifications (id, customer_id, title, message, type, read) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, customer_id, title, message, type, false]
      );
      return res.rows[0];
    }

    memoryStore.notifications.unshift(notification);
    return notification;
  },

  async getNotificationsByCustomer(customerId) {
    if (isPostgresConnected) {
      const res = await pool.query('SELECT * FROM notifications WHERE customer_id = $1 ORDER BY created_at DESC', [customerId]);
      return res.rows;
    }
    return memoryStore.notifications
      .filter((n) => n.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async markNotificationRead(id, customerId) {
    if (isPostgresConnected) {
      const res = await pool.query('UPDATE notifications SET read = true WHERE id = $1 AND customer_id = $2 RETURNING *', [id, customerId]);
      return res.rows[0];
    }
    const notif = memoryStore.notifications.find((n) => n.id === id && n.customer_id === customerId);
    if (notif) notif.read = true;
    return notif;
  },

  async markAllNotificationsRead(customerId) {
    if (isPostgresConnected) {
      await pool.query('UPDATE notifications SET read = true WHERE customer_id = $1', [customerId]);
      return true;
    }
    memoryStore.notifications.forEach((n) => {
      if (n.customer_id === customerId) n.read = true;
    });
    return true;
  }
};
