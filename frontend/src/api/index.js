import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
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