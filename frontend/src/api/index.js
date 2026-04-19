import axios from 'axios'

const api = axios.create({
  baseURL: 'https://smartseason-field-monitoring-backend.onrender.com/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export const login = (credentials) => api.post('/auth/login/', credentials)
export const logout = () => api.post('/auth/logout/')
export const getFields = () => api.get('/fields/')
export const createField = (data) => api.post('/fields/', data)
export const updateField = (id, data) => api.put(`/fields/${id}/`, data)
export const getFieldUpdates = (id) => api.get(`/fields/${id}/updates/`)
export const addFieldUpdate = (id, data) => api.post(`/fields/${id}/updates/`, data)
export const getDashboard = () => api.get('/dashboard/')
export const getAgents = () => api.get('/agents/')
export const createAgent = (data) => api.post('/agents/create/', data)
export const updateAgent = (id, data) => api.put(`/agents/${id}/update/`, data)
export const deactivateAgent = (id) => api.put(`/agents/${id}/deactivate/`)