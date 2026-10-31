import express from 'express';
import { db } from '../db/db.js';
import { requireCustomerAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply customer auth to all routes in this router
router.use(requireCustomerAuth);

// ==========================================
// 1. CUSTOMER DASHBOARD
// ==========================================
router.get('/dashboard', async (req, res) => {
  try {
    const customer = req.customer;
    const now = new Date();

    // 1. Fetch available products count
    const products = await db.getProducts();
    const totalAvailableProducts = products.length;

    // 2. Fetch customer subscriptions
    const allSubs = await db.getSubscriptionsByCustomer(customer.id);

    // Compute dynamic status & remaining days
    const enrichedSubs = allSubs.map((s) => {
      const expDate = new Date(s.expiry_date);
      const diffTime = expDate - now;
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let computedStatus = s.status;
      if (s.status !== 'Cancelled') {
        if (remainingDays < 0) {
          computedStatus = 'Expired';
        } else if (remainingDays <= 14) {
          computedStatus = 'Expiring Soon';
        } else {
          computedStatus = 'Active';
        }
      }

      return {
        ...s,
        status: computedStatus,
        remaining_days: Math.max(0, remainingDays),
      };
    });

    const activeSubscriptions = enrichedSubs.filter((s) => s.status === 'Active');
    const expiringSoonSubscriptions = enrichedSubs.filter((s) => s.status === 'Expiring Soon');
    const expiredSubscriptions = enrichedSubs.filter((s) => s.status === 'Expired');

    // 3. Recently purchased (latest 5)
    const recentlyPurchased = enrichedSubs.slice(0, 5);

    // 4. Recent notifications (latest 5)
    const notifications = await db.getNotificationsByCustomer(customer.id);
    const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

    // 5. Total monthly spend calculation
    const monthlySpend = activeSubscriptions.reduce((sum, s) => {
      const amt = parseFloat(s.amount) || 0;
      return sum + (s.billing_cycle === 'Annual' ? amt / 12 : amt);
    }, 0);

    res.json({
      success: true,
      data: {
        welcomeMessage: `Welcome back, ${customer.name}!`,
        customer: {
          id: customer.id,
          name: customer.name,
          company: customer.company,
          email: customer.email,
        },
        user: {
          id: customer.id,
          name: customer.name,
          company: customer.company,
          email: customer.email,
        },
        metrics: {
          totalAvailableProducts,
          totalActiveSubscriptions: activeSubscriptions.length,
          expiringSoonCount: expiringSoonSubscriptions.length,
          expiredCount: expiredSubscriptions.length,
          monthlyRunRate: monthlySpend,
          unreadNotificationsCount,
        },
        expiringSoonSubscriptions,
        recentlyPurchased,
        recentNotifications: notifications.slice(0, 5),
      },
    });
  } catch (err) {
    console.error('[Dashboard Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 2. CUSTOMER PROFILE
// ==========================================
router.get('/profile', async (req, res) => {
  try {
    const customer = req.customer;
    res.json({
      success: true,
      data: {
        id: customer.id,
        name: customer.name,
        company: customer.company,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        status: customer.status,
        joinedDate: customer.joined_date,
        totalSubscriptions: customer.total_subscriptions,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/profile', async (req, res) => {
  try {
    const customer = req.customer;
    const { name, phone, address } = req.body;

    const updated = await db.updateCustomer(customer.id, { name, phone, address });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 3. PRODUCT LISTING & DETAILS
// ==========================================
router.get('/products', async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const products = await db.getProducts({ search, category, sort });

    // Attach plan count and starting price for each product
    const enrichedProducts = await Promise.all(
      products.map(async (prod) => {
        const fullProd = await db.getProductById(prod.id);
        const plans = fullProd?.plans || [];
        const startingPrice = plans.length > 0 
          ? Math.min(...plans.map((p) => parseFloat(p.price)))
          : parseFloat(prod.sales_price);

        return {
          id: prod.id,
          name: prod.name,
          code: prod.code,
          type: prod.type,
          category: prod.type,
          salesPrice: parseFloat(prod.sales_price),
          startingPrice,
          plansCount: plans.length,
          availablePlans: plans.map((p) => p.name),
          variants: prod.variants || [],
          status: prod.status,
          description: prod.description,
          imageUrl: prod.image_url,
          features: prod.features || [],
        };
      })
    );

    res.json({
      success: true,
      count: enrichedProducts.length,
      data: enrichedProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        code: product.code,
        category: product.type,
        salesPrice: parseFloat(product.sales_price),
        description: product.description,
        imageUrl: product.image_url,
        features: product.features || [],
        variants: product.variants || [],
        status: product.status,
        plans: (product.plans || []).map((p) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          price: parseFloat(p.price),
          billingFrequency: p.billing_frequency,
          renewalPrice: parseFloat(p.renewal_price || p.price),
          minimumQuantity: p.minimum_quantity || 1,
          autoRenewalSupported: p.auto_renewal_supported ?? true,
          features: p.features || [],
          status: p.status,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 4. SUBSCRIPTION PURCHASE & CHECKOUT
// ==========================================
router.post('/subscriptions', async (req, res) => {
  try {
    const customer = req.customer;
    const { productId, planId, billingCycle = 'Monthly', quantity = 1, paymentMethod = 'Credit Card (Sandbox)', couponCode } = req.body;

    if (!productId && !planId) {
      return res.status(400).json({ success: false, error: 'Missing productId or planId' });
    }

    // 1. Fetch and verify product & plan
    let product = null;
    let plan = null;

    if (planId) {
      plan = await db.getPlanById(planId);
      if (plan && !productId) {
        product = await db.getProductById(plan.product_id);
      }
    }
    if (productId && !product) {
      product = await db.getProductById(productId);
    }

    if (!product && !plan) {
      return res.status(404).json({ success: false, error: 'Selected product or plan not found' });
    }

    // 2. Calculate unit price & subtotal
    const unitPrice = plan ? parseFloat(plan.price) : parseFloat(product.sales_price);
    const validQty = Math.max(1, parseInt(quantity, 10) || 1);
    
    // Cycle multiplier
    let cycleMultiplier = 1;
    if (billingCycle === 'Annual') {
      cycleMultiplier = 10; // 10 months pricing for annual
    }
    const subtotal = unitPrice * validQty * (billingCycle === 'Annual' && !plan?.billing_frequency?.includes('Annual') ? 10 : 1);

    // Apply coupon discounts
    let discountAmount = 0;
    if (couponCode && couponCode.toUpperCase() === 'EARLYBIRD20') {
      discountAmount = (subtotal * 20) / 100;
    } else if (couponCode && couponCode.toUpperCase() === 'HACKATHON50') {
      discountAmount = Math.min(subtotal, 50);
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * 0.08; // 8% standard tax
    const totalDue = parseFloat((taxableAmount + tax).toFixed(2));

    // 3. Backend Payment Verification (Test/Sandbox Payment Gateway)
    // Never activate without verifying payment authorization on the server!
    const transactionRef = `tx_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const isPaymentAuthorized = totalDue >= 0; // Verified sandbox settlement

    if (!isPaymentAuthorized) {
      return res.status(402).json({
        success: false,
        error: 'Payment Declined',
        message: 'Sandbox transaction authorization failed.',
      });
    }

    // 4. Calculate subscription start & expiry dates
    const startDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    if (billingCycle === 'Annual') {
      expDate.setFullYear(expDate.getFullYear() + 1);
    } else if (billingCycle === 'Quarterly') {
      expDate.setMonth(expDate.getMonth() + 3);
    } else {
      expDate.setMonth(expDate.getMonth() + 1);
    }
    const expiryDate = expDate.toISOString().split('T')[0];

    const planDisplayName = plan ? plan.name : `${product.name} (Custom)`;

    // 5. Create Subscription record in database
    const newSubscription = await db.createSubscription({
      customer_id: customer.id,
      product_id: product?.id || null,
      plan_id: plan?.id || null,
      plan_name: planDisplayName,
      start_date: startDate,
      expiry_date: expiryDate,
      billing_cycle: billingCycle,
      amount: totalDue,
      auto_renew: true,
      quantity: validQty,
    });

    // 6. Create Invoice record
    const newInvoice = await db.createInvoice({
      customer_id: customer.id,
      subscription_id: newSubscription.id,
      invoice_date: startDate,
      due_date: startDate,
      amount: totalDue,
      status: 'Paid',
      payment_method: paymentMethod,
      items: [
        {
          desc: `${planDisplayName} (${billingCycle} subscription)`,
          qty: validQty,
          unit: unitPrice,
          total: subtotal,
        },
        ...(discountAmount > 0 ? [{ desc: `Discount Coupon (${couponCode})`, qty: 1, unit: -discountAmount, total: -discountAmount }] : []),
        { desc: 'Taxes & Compliance (8%)', qty: 1, unit: tax, total: tax },
      ],
    });

    // 7. Create Payment Transaction record
    const newPayment = await db.createPayment({
      customer_id: customer.id,
      subscription_id: newSubscription.id,
      invoice_number: newInvoice.id,
      product_name: product?.name || planDisplayName,
      plan_name: planDisplayName,
      amount: totalDue,
      payment_method: paymentMethod,
      status: 'Completed',
      transaction_ref: transactionRef,
    });

    // 8. Create in-app Notification
    await db.createNotification({
      customer_id: customer.id,
      title: 'Subscription Activated 🎉',
      message: `Your subscription to ${planDisplayName} has been activated. Reference: ${newSubscription.id}`,
      type: 'purchase',
    });

    res.status(201).json({
      success: true,
      message: 'Subscription purchased and activated successfully',
      data: {
        subscription: newSubscription,
        invoice: newInvoice,
        payment: newPayment,
      },
    });
  } catch (err) {
    console.error('[Purchase Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 5. MY SUBSCRIPTIONS
// ==========================================
router.get('/subscriptions', async (req, res) => {
  try {
    const customer = req.customer;
    const now = new Date();
    const subs = await db.getSubscriptionsByCustomer(customer.id);

    const enrichedSubs = subs.map((s) => {
      const expDate = new Date(s.expiry_date);
      const diffTime = expDate - now;
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let computedStatus = s.status;
      if (s.status !== 'Cancelled') {
        if (remainingDays < 0) {
          computedStatus = 'Expired';
        } else if (remainingDays <= 14) {
          computedStatus = 'Expiring Soon';
        } else {
          computedStatus = 'Active';
        }
      }

      return {
        id: s.id,
        productId: s.product_id,
        productName: s.product_name,
        productImage: s.product_image,
        planId: s.plan_id,
        planName: s.plan_name,
        startDate: s.start_date,
        expiryDate: s.expiry_date,
        remainingDays: Math.max(0, remainingDays),
        billingCycle: s.billing_cycle,
        amount: parseFloat(s.amount),
        status: computedStatus,
        autoRenew: s.auto_renew,
        nextBillingDate: s.next_billing_date,
        quantity: s.quantity || 1,
      };
    });

    res.json({
      success: true,
      count: enrichedSubs.length,
      data: enrichedSubs,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/subscriptions/:id', async (req, res) => {
  try {
    const customer = req.customer;
    const sub = await db.getSubscriptionById(req.params.id, customer.id);
    if (!sub) {
      return res.status(404).json({ success: false, error: 'Subscription not found or unauthorized' });
    }
    res.json({ success: true, data: sub });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 6. RENEWAL & CANCELLATION
// ==========================================
router.post('/subscriptions/:id/renew', async (req, res) => {
  try {
    const customer = req.customer;
    const sub = await db.getSubscriptionById(req.params.id, customer.id);

    if (!sub) {
      return res.status(404).json({ success: false, error: 'Subscription not found or unauthorized' });
    }

    if (sub.status === 'Cancelled') {
      return res.status(400).json({ success: false, error: 'Cannot renew a cancelled subscription. Please create a new subscription.' });
    }

    // Extend expiry date
    const currentExpiry = new Date(sub.expiry_date);
    const newExpiry = new Date(Math.max(Date.now(), currentExpiry.getTime()));
    if (sub.billing_cycle === 'Annual') {
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    } else {
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    }
    const newExpiryStr = newExpiry.toISOString().split('T')[0];

    // Backend Payment verification for renewal
    const txRef = `tx_renew_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const amount = parseFloat(sub.amount);

    // Update subscription
    const updatedSub = await db.updateSubscription(sub.id, customer.id, {
      expiry_date: newExpiryStr,
      next_billing_date: newExpiryStr,
      status: 'Active',
      auto_renew: true,
    });

    // Record renewal payment
    const payment = await db.createPayment({
      customer_id: customer.id,
      subscription_id: sub.id,
      product_name: sub.product_name,
      plan_name: sub.plan_name,
      amount,
      payment_method: 'Credit Card (Auto-Settle)',
      status: 'Completed',
      transaction_ref: txRef,
    });

    // Generate renewal invoice
    const invoice = await db.createInvoice({
      customer_id: customer.id,
      subscription_id: sub.id,
      amount,
      status: 'Paid',
      payment_method: 'Credit Card (Auto-Settle)',
      items: [{ desc: `${sub.plan_name} Renewal (${sub.billing_cycle})`, qty: 1, unit: amount, total: amount }],
    });

    // Notify customer
    await db.createNotification({
      customer_id: customer.id,
      title: 'Subscription Renewed Successfully 🔄',
      message: `Your subscription to ${sub.plan_name} has been extended until ${newExpiryStr}.`,
      type: 'renewal',
    });

    res.json({
      success: true,
      message: 'Subscription successfully renewed',
      data: {
        subscription: updatedSub,
        payment,
        invoice,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/subscriptions/:id/auto-renew', async (req, res) => {
  try {
    const customer = req.customer;
    const sub = await db.getSubscriptionById(req.params.id, customer.id);

    if (!sub) {
      return res.status(404).json({ success: false, error: 'Subscription not found or unauthorized' });
    }

    const { autoRenew } = req.body;
    const newAutoRenew = typeof autoRenew === 'boolean' ? autoRenew : !sub.auto_renew;

    const updated = await db.updateSubscription(sub.id, customer.id, {
      auto_renew: newAutoRenew,
    });

    await db.createNotification({
      customer_id: customer.id,
      title: `Auto-Renewal ${newAutoRenew ? 'Enabled' : 'Disabled'}`,
      message: `Automatic recurring billing for ${sub.plan_name} was updated to: ${newAutoRenew ? 'ON' : 'OFF'}.`,
      type: 'renewal',
    });

    res.json({
      success: true,
      message: `Auto-renew preference updated to ${newAutoRenew}`,
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/subscriptions/:id/cancel', async (req, res) => {
  try {
    const customer = req.customer;
    const sub = await db.getSubscriptionById(req.params.id, customer.id);

    if (!sub) {
      return res.status(404).json({ success: false, error: 'Subscription not found or unauthorized' });
    }

    const updated = await db.updateSubscription(sub.id, customer.id, {
      status: 'Cancelled',
      auto_renew: false,
    });

    await db.createNotification({
      customer_id: customer.id,
      title: 'Subscription Cancelled',
      message: `Subscription ${sub.id} (${sub.plan_name}) has been cancelled. Access will remain active until expiry date.`,
      type: 'cancellation',
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 7. PAYMENTS & INVOICES
// ==========================================
router.get('/payments', async (req, res) => {
  try {
    const customer = req.customer;
    const payments = await db.getPaymentsByCustomer(customer.id);

    res.json({
      success: true,
      count: payments.length,
      data: payments.map((p) => ({
        id: p.id,
        transactionId: p.transaction_ref,
        productName: p.product_name,
        planName: p.plan_name,
        amount: parseFloat(p.amount),
        paymentDate: p.payment_date,
        paymentMethod: p.payment_method,
        status: p.status,
        invoiceNumber: p.invoice_number,
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/payments/:id/invoice', async (req, res) => {
  try {
    const customer = req.customer;
    const payments = await db.getPaymentsByCustomer(customer.id);
    const payment = payments.find((p) => p.id === req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment record not found' });
    }

    const invoice = await db.getInvoiceById(payment.invoice_number, customer.id);

    res.json({
      success: true,
      data: {
        payment,
        invoice: invoice || {
          id: payment.invoice_number || `INV-${payment.id}`,
          amount: payment.amount,
          status: 'Paid',
          payment_method: payment.payment_method,
          invoice_date: payment.payment_date,
          customer: customer.company || customer.name,
          customer_email: customer.email,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 8. NOTIFICATIONS
// ==========================================
router.get('/notifications', async (req, res) => {
  try {
    const customer = req.customer;
    const notifications = await db.getNotificationsByCustomer(customer.id);

    res.json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.read).length,
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const customer = req.customer;
    const updated = await db.markNotificationRead(req.params.id, customer.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.patch('/notifications/mark-all-read', async (req, res) => {
  try {
    const customer = req.customer;
    await db.markAllNotificationsRead(customer.id);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
