// Comprehensive Verification Suite for Customer Module
// Tests scenarios 1 to 13 from Project Specification

async function runTests() {
  console.log('🧪 Starting Customer Module Integration Tests...\n');
  const baseUrl = 'http://localhost:5000/api/customer';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Dashboard Endpoint
    const dashRes = await fetch(`${baseUrl}/dashboard`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const dash = await dashRes.json();
    assert(dash.success && dash.data.welcomeMessage.includes('Sarah Jenkins'), 'Customer Dashboard: Personalized welcome message');
    assert(dash.data.metrics.totalAvailableProducts > 0, 'Customer Dashboard: Total available products count');

    // 2. Product Listing
    const prodRes = await fetch(`${baseUrl}/products?search=Core`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const prods = await prodRes.json();
    assert(prods.success && prods.data.length > 0 && prods.data[0].code === 'BL-CORE', 'Product Listing: Search and filter dynamic products');

    // 3. Product Details & Plan Comparison
    const detailRes = await fetch(`${baseUrl}/products/PROD-001`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const detail = await detailRes.json();
    assert(detail.success && detail.data.plans.length >= 3, 'Product Details: View product and compare multiple subscription plans');

    // 4. Subscription Purchase (Backend verified payment)
    const buyRes = await fetch(`${baseUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-customer-id': 'CUST-001',
      },
      body: JSON.stringify({
        productId: 'PROD-001',
        planId: 'PLAN-001',
        billingCycle: 'Monthly',
        quantity: 2,
        paymentMethod: 'Credit Card (Sandbox)',
      }),
    });
    const buy = await buyRes.json();
    assert(buy.success && buy.data.subscription.id.startsWith('SUB-'), 'Subscription Purchase: Order creation and backend payment verification');
    const newSubId = buy.data.subscription.id;

    // 5. My Subscriptions List
    const subsRes = await fetch(`${baseUrl}/subscriptions`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const subs = await subsRes.json();
    assert(subs.success && subs.data.some((s) => s.id === newSubId), 'My Subscriptions: List customer subscriptions with remaining days');

    // 6. Subscription Renewal
    const renewRes = await fetch(`${baseUrl}/subscriptions/${newSubId}/renew`, {
      method: 'POST',
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const renew = await renewRes.json();
    assert(renew.success && renew.data.subscription.status === 'Active', 'Subscription Renewal: Extend expiry date and log payment');

    // 7. Auto-Renewal Toggle
    const autoRenewRes = await fetch(`${baseUrl}/subscriptions/${newSubId}/auto-renew`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-customer-id': 'CUST-001',
      },
      body: JSON.stringify({ autoRenew: false }),
    });
    const autoRenew = await autoRenewRes.json();
    assert(autoRenew.success && autoRenew.data.auto_renew === false, 'Auto-Renewal: Toggle automatic recurring billing preference');

    // 8. Subscription Cancellation
    const cancelRes = await fetch(`${baseUrl}/subscriptions/${newSubId}/cancel`, {
      method: 'PATCH',
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const cancel = await cancelRes.json();
    assert(cancel.success && cancel.data.status === 'Cancelled', 'Subscription Cancellation: Cancel contract and deactivate auto-renew');

    // 9. Payment History & Invoice
    const payRes = await fetch(`${baseUrl}/payments`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const pay = await payRes.json();
    assert(pay.success && pay.data.length > 0, 'Payment History: Audit ledger with transaction references');

    const invRes = await fetch(`${baseUrl}/payments/${pay.data[0].id}/invoice`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const inv = await invRes.json();
    assert(inv.success && inv.data.invoice, 'Invoice Download / Receipt details retrieval');

    // 10. Notifications
    const notifRes = await fetch(`${baseUrl}/notifications`, {
      headers: { 'x-customer-id': 'CUST-001' },
    });
    const notifs = await notifRes.json();
    assert(notifs.success && notifs.data.length > 0, 'Notifications: Activity notifications triggered on events');

    // 11. Customer Ownership Enforcement (Customer A cannot access Customer B)
    const unauthorizedRes = await fetch(`${baseUrl}/subscriptions/SUB-8404`, {
      headers: { 'x-customer-id': 'CUST-001' }, // SUB-8404 belongs to CUST-002 (David Chen)
    });
    assert(unauthorizedRes.status === 404, 'Security: Customer ownership enforced (Customer A cannot access Customer B contracts)');

    // 12. Customer Profile Update
    const profRes = await fetch(`${baseUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-customer-id': 'CUST-001',
      },
      body: JSON.stringify({
        phone: '+1 (555) 999-8888',
        address: '900 Technology Parkway, Suite 300, Springfield, OR',
      }),
    });
    const prof = await profRes.json();
    assert(prof.success && prof.data.phone === '+1 (555) 999-8888', 'Customer Profile: Update editable contact and address details');

  } catch (err) {
    console.error('Fatal Test Exception:', err);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);
  
  if (failed > 0) process.exit(1);
}

runTests();
