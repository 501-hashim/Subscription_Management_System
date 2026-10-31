// Brightloop Customer API Service Layer
// Communicates with Express Backend at /api/customer

let currentCustomerId = 'CUST-001';

export function setActiveCustomerId(id) {
  if (id) {
    currentCustomerId = id;
  }
}

export function getActiveCustomerId() {
  return currentCustomerId;
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-customer-id': currentCustomerId,
    ...(options.headers || {}),
  };

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json.message || json.error || `HTTP error ${response.status}`);
  }

  return json;
}

export const customerApi = {
  // 1. Dashboard
  async getDashboard() {
    const res = await request('/api/customer/dashboard');
    return res.data;
  },

  // 2. Profile
  async getProfile() {
    const res = await request('/api/customer/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await request('/api/customer/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return res.data;
  },

  // 3. Products
  async getProducts({ search = '', category = 'All', sort = 'price_asc' } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category && category !== 'All') params.append('category', category);
    if (sort) params.append('sort', sort);

    const res = await request(`/api/customer/products?${params.toString()}`);
    return res.data || [];
  },

  async getProductById(id) {
    const res = await request(`/api/customer/products/${id}`);
    return res.data;
  },

  // 4. Subscriptions
  async purchaseSubscription(purchaseData) {
    const res = await request('/api/customer/subscriptions', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
    return res.data;
  },

  async getSubscriptions() {
    const res = await request('/api/customer/subscriptions');
    return res.data || [];
  },

  async getSubscriptionById(id) {
    const res = await request(`/api/customer/subscriptions/${id}`);
    return res.data;
  },

  async renewSubscription(id) {
    const res = await request(`/api/customer/subscriptions/${id}/renew`, {
      method: 'POST',
    });
    return res.data;
  },

  async toggleAutoRenew(id, autoRenew) {
    const res = await request(`/api/customer/subscriptions/${id}/auto-renew`, {
      method: 'PATCH',
      body: JSON.stringify({ autoRenew }),
    });
    return res.data;
  },

  async cancelSubscription(id) {
    const res = await request(`/api/customer/subscriptions/${id}/cancel`, {
      method: 'PATCH',
    });
    return res.data;
  },

  // 5. Payments & Invoices
  async getPayments() {
    const res = await request('/api/customer/payments');
    return res.data || [];
  },

  async getPaymentInvoice(paymentId) {
    const res = await request(`/api/customer/payments/${paymentId}/invoice`);
    return res.data;
  },

  // 6. Notifications
  async getNotifications() {
    const res = await request('/api/customer/notifications');
    return res.data || [];
  },

  async markNotificationRead(id) {
    const res = await request(`/api/customer/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async markAllNotificationsRead() {
    const res = await request('/api/customer/notifications/mark-all-read', {
      method: 'PATCH',
    });
    return res;
  },
};
