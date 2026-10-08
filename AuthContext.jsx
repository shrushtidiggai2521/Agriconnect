import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthService from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => AuthService.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const data = await AuthService.login(credentials)
      setUser(data.user ?? data)
      toast.success(`Welcome back${data.user?.name ? ', ' + data.user.name : ''}!`)
      const role = (data.user ?? data)?.role
      navigate(role === 'FARMER' ? '/farmer/dashboard' : '/dashboard')
      return data
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const data = await AuthService.register(payload)
      toast.success('Account created. Please log in.')
      navigate('/login')
      return data
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    AuthService.logout()
    setUser(null)
    navigate('/login')
  }, [navigate])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
