import axios from 'axios'

// Use environment variable or default to relative path for development
const getBaseURL = () => {
  // In production, use the backend URL from environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_BASE_URL || 'https://image-sharing-backend-mzr-eradcrcdedctbqbr.uksouth-01.azurewebsites.net/api'
  }
  // In development, use relative path (will be proxied by Vite)
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  withCredentials: true
})

// Request interceptor
api.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 0) {
      return res.data
    } else {
      return Promise.reject(new Error(res.message || 'Request failed'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default api

