import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from '@/utils/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle token expiration / unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please log in again.')
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error("You don't have permission to do that.")
    } else if (status >= 500) {
      toast.error('Something went wrong on our end. Please try again.')
    } else if (!error.response) {
      toast.error('Cannot reach the server. Check your connection.')
    }

    return Promise.reject(error)
  }
)

export default api
