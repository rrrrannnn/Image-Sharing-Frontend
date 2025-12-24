import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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

