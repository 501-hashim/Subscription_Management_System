// Brightloop User API Service Layer
// Communicates with Express Backend at /api/user

let currentUserId = 'CUST-001';

export function setActiveUserId(id) {
  if (id) {
    currentUserId = id;
  }
}

export function getActiveUserId() {
  return currentUserId;
}

// Compatibility alias
export const setActiveCustomerId = setActiveUserId;
export const getActiveCustomerId = getActiveUserId;

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    'x-customer-id': currentUserId,
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

export const userApi = {
  // 1. Dashboard
  async getDashboard() {
    const res = await request('/api/user/dashboard');
    return res.data;
  },

  // 2. Profile
  async getProfile() {
    const res = await request('/api/user/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await request('/api/user/profile', {
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

    const res = await request(`/api/user/products?${params.toString()}`);
    return res.data || [];
  },

  async getProductById(id) {
    const res = await request(`/api/user/products/${id}`);
    return res.data;
  },

  // 4. Subscriptions
  async purchaseSubscription(purchaseData) {
    const res = await request('/api/user/subscriptions', {
      method: 'POST',
      body: JSON.stringify(purchaseData),
    });
    return res.data;
  },

  async getSubscriptions() {
    const res = await request('/api/user/subscriptions');
    return res.data || [];
  },

  async getSubscriptionById(id) {
    const res = await request(`/api/user/subscriptions/${id}`);
    return res.data;
  },

  async renewSubscription(id) {
    const res = await request(`/api/user/subscriptions/${id}/renew`, {
      method: 'POST',
    });
    return res.data;
  },

  async toggleAutoRenew(id, autoRenew) {
    const res = await request(`/api/user/subscriptions/${id}/auto-renew`, {
      method: 'PATCH',
      body: JSON.stringify({ autoRenew }),
    });
    return res.data;
  },

  async cancelSubscription(id) {
    const res = await request(`/api/user/subscriptions/${id}/cancel`, {
      method: 'PATCH',
    });
    return res.data;
  },

  // 5. Payments & Invoices
  async getPayments() {
    const res = await request('/api/user/payments');
    return res.data || [];
  },

  async getPaymentInvoice(paymentId) {
    const res = await request(`/api/user/payments/${paymentId}/invoice`);
    return res.data;
  },

  // 6. Notifications
  async getNotifications() {
    const res = await request('/api/user/notifications');
    return res.data || [];
  },

  async markNotificationRead(id) {
    const res = await request(`/api/user/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async markAllNotificationsRead() {
    const res = await request('/api/user/notifications/mark-all-read', {
      method: 'PATCH',
    });
    return res;
  },
};

export const customerApi = userApi;
export default userApi;
