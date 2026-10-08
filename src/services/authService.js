import api from './api'
import { TOKEN_KEY, USER_KEY } from '@/utils/constants'

const AuthService = {
  async login(credentials) {
  const { data: body } = await api.post('/auth/login', credentials)
  const loginpayload = body.data ?? body   // unwrap the envelope, fall back if shape ever changes
  const token = loginpayload?.token ?? loginpayload?.accessToken ?? loginpayload?.jwt ?? loginpayload?.access_token
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(loginpayload.user ?? loginpayload))
  }
  return { ...loginpayload, token }
  },

  async register(payload) {
    const { data: body } = await api.post('/auth/register', payload)
    const registerpayload = body.data ?? body   // unwrap the envelope, fall back if shape ever changes
    return registerpayload
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

export default AuthService
