import http, { authHeaders } from './http';

export const authApi = {
  register: async (payload) => (await http.post('/auth/register', payload)).data,
  login: async (payload) => (await http.post('/auth/login', payload)).data,
  me: async (token) => (await http.get('/auth/me', authHeaders(token))).data
};

export const dashboardApi = {
  analytics: async (token) => (await http.get('/dashboard/analytics', authHeaders(token))).data,
  reports: async (token, params) => (
    await http.get('/dashboard/reports', { ...authHeaders(token), params })
  ).data
};

export const inventoryApi = {
  getAll: async (token) => (await http.get('/inventory', authHeaders(token))).data,
  create: async (token, payload) => (await http.post('/inventory', payload, authHeaders(token))).data
};

export const transactionApi = {
  getAll: async (token, params) => (
    await http.get('/transactions', { ...authHeaders(token), params })
  ).data,
  create: async (token, payload) => (await http.post('/transactions', payload, authHeaders(token))).data
};

export const partyApi = {
  suppliers: async (token) => (await http.get('/parties/suppliers', authHeaders(token))).data,
  createSupplier: async (token, payload) => (
    await http.post('/parties/suppliers', payload, authHeaders(token))
  ).data,
  updateSupplier: async (token, id, payload) => (
    await http.put(`/parties/suppliers/${id}`, payload, authHeaders(token))
  ).data,
  deleteSupplier: async (token, id) => (
    await http.delete(`/parties/suppliers/${id}`, authHeaders(token))
  ).data,
  customers: async (token) => (await http.get('/parties/customers', authHeaders(token))).data,
  createCustomer: async (token, payload) => (
    await http.post('/parties/customers', payload, authHeaders(token))
  ).data,
  updateCustomer: async (token, id, payload) => (
    await http.put(`/parties/customers/${id}`, payload, authHeaders(token))
  ).data,
  deleteCustomer: async (token, id) => (
    await http.delete(`/parties/customers/${id}`, authHeaders(token))
  ).data
};

export const productApi = {
  getAll: async (params) => (await http.get('/products', { params })).data,
  getById: async (id) => (await http.get(`/products/${id}`)).data,
  create: async (payload) => (await http.post('/products', payload)).data,
  update: async (id, payload) => (await http.put(`/products/${id}`, payload)).data,
  remove: async (id) => (await http.delete(`/products/${id}`)).data
};
