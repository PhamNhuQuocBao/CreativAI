import { APIs } from '@/config'
import { ENDPOINTS } from '@/constants'
import Cookies from 'js-cookie'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    _id: string
    name: string
    email: string
    avatar?: string
    bio?: string
  }
}

export interface UpdateProfileData {
  name?: string
  email?: string
  bio?: string
  avatar?: string
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await APIs.post(ENDPOINTS.REGISTER, data)
    return response.data
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await APIs.post(ENDPOINTS.LOGIN, data)
    if (response.data.token) {
      // Store token in HTTP-only cookie
      Cookies.set('token', response.data.token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      // Store user data in localStorage (non-sensitive data)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    const response = await APIs.put(ENDPOINTS.UPDATE_PROFILE, data)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  }

  logout(): void {
    Cookies.remove('token')
    localStorage.removeItem('user')
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) return JSON.parse(userStr)
    return null
  }

  getToken() {
    return Cookies.get('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

const authService = new AuthService()

export default authService
