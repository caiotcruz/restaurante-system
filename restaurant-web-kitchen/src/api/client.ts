import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    const { state } = JSON.parse(raw)
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
  }
  return config
})

export default api