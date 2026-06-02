import api from './client'

export const authApi = {
  signup: (data)   => api.post('/auth/signup', data),
  login:  (data)   => api.post('/auth/login', data),
  me:     ()       => api.get('/auth/me'),
}

export const productsApi = {
  list:        (params)     => api.get('/products', { params }),
  get:         (id)         => api.get(`/products/${id}`),
  create:      (data)       => api.post('/products', data),
  update:      (id, data)   => api.patch(`/products/${id}`, data),
  adjustStock: (id, data)   => api.patch(`/products/${id}/adjust-stock`, data),
  remove:      (id)         => api.delete(`/products/${id}`),
}

export const dashboardApi = {
  get: () => api.get('/dashboard'),
}

export const settingsApi = {
  get:    ()     => api.get('/settings'),
  update: (data) => api.patch('/settings', data),
}
