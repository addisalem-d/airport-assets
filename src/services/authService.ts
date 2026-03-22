import { api } from './api'
import type { User } from '../types/User'

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  user: User
}

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    try {
      const res = await api.post<TokenResponse>('/auth/login', {
        username,
        password,
      })
      const { access_token, user } = res.data
      
      console.log('✅ Login successful, storing token:', access_token.substring(0, 20) + '...')
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      
      // Dispatch auth event (same tab) and verify token was stored
      window.dispatchEvent(new Event('authChanged'))
      const stored = localStorage.getItem('token')
      console.log('✓ Token stored in localStorage:', !!stored)
      
      return res.data
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  },

  logout() {
    console.log('🚪 Logging out - clearing token')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
