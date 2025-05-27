import axios from 'axios'
import Cookies from 'js-cookie'

export const API_URL = process.env.API_URL || 'http://localhost:6789/api'

export const APIs = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

APIs.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

APIs.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear auth data
      Cookies.remove('token')
      localStorage.removeItem('user')

      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/auth/login')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)
