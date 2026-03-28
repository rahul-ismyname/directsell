const API_BASE_URL = '/api';

const fetchWithToken = async (endpoint, options = {}) => {
  const token = localStorage.getItem('b2c_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API Error');
  }

  return response.json();
};

const api = {
  auth: {
    register: (data) => fetchWithToken('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => fetchWithToken('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchWithToken('/auth/me'),
    orders: () => fetchWithToken('/user/orders'),
    verify: (data) => fetchWithToken('/auth/verify', { method: 'POST', body: JSON.stringify(data) }),
    submitKYC: (data) => fetchWithToken('/auth/kyc', { method: 'POST', body: JSON.stringify(data) }),
  },
  products: {
    getAll: () => fetchWithToken('/products'),
    add: (data) => fetchWithToken('/products', { method: 'POST', body: JSON.stringify(data) }),
    verify: (id) => fetchWithToken(`/products/${id}/verify`, { method: 'POST' }),
    closeOrders: (id) => fetchWithToken(`/products/${id}/close-orders`, { method: 'POST' }),
    ship: (id, city) => fetchWithToken(`/products/${id}/ship`, { method: 'POST', body: JSON.stringify({ city }) }),
    getRegionalPools: () => fetchWithToken('/seller/regional-pools'),
  },
  pools: {
    join: (data) => fetchWithToken('/pools/join', { method: 'POST', body: JSON.stringify(data) }),
  },
  reviews: {
    submit: (data) => fetchWithToken('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  },
  reports: {
    submit: (data) => fetchWithToken('/reports', { method: 'POST', body: JSON.stringify(data) }),
  },
  distributors: {
    getPools: () => fetchWithToken('/distributor/pools'),
    getAvailable: () => fetchWithToken('/distributor/available-pools'),
    claimPool: (productId) => fetchWithToken('/distributor/claim-pool', { method: 'POST', body: JSON.stringify({ productId }) }),
    markReceived: (productId) => fetchWithToken('/distributor/mark-received', { method: 'POST', body: JSON.stringify({ productId }) }),
    notifyUsers: (productId) => fetchWithToken('/distributor/notify-users', { method: 'POST', body: JSON.stringify({ productId }) }),
    submitReview: (data) => fetchWithToken('/distributors/reviews', { method: 'POST', body: JSON.stringify(data) }),
    getReviews: (distributorId) => fetchWithToken(`/distributors/${distributorId}/reviews`),
  },
  deals: {
    getAll: () => fetchWithToken('/deals'),
    getOne: (id) => fetchWithToken(`/deals/${id}`),
    create: (data) => fetchWithToken('/deals', { method: 'POST', body: JSON.stringify(data) }),
    purchaseShare: (dealId, units) => fetchWithToken(`/deals/${dealId}/shares`, { method: 'POST', body: JSON.stringify({ units }) }),
    getUserShares: () => fetchWithToken('/user/shares'),
  }
};

export default api;
