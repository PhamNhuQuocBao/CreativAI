import axios from 'axios'

export const API_URL = process.env.API_URL || 'http://localhost:6789/api'

export const APIs = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

APIs.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

APIs.interceptors.response.use((response) => {
  return response
})
