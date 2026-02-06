import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthUser } from './AuthContext'
import { login as loginApi, me } from '../api/auth.api'
import api from '../api/axios'


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const initAuth = async () => {
    const storedToken = localStorage.getItem('token')

    if (!storedToken) {
      setIsLoading(false)
      return
    }

    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`

    try {
      const user = await me() // ← must return { userId, orgId, role }

      setToken(storedToken)
      setUser({
        userId: user.userId,
        orgId: user.orgId,
        role: user.role,
      })
    } catch {
      localStorage.removeItem('token')
      delete api.defaults.headers.common.Authorization
      setUser(null)
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  initAuth()
}, [])

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password)

    localStorage.setItem('token', data.accessToken)
    api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

    setToken(data.accessToken)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
    setUser(null)
    setToken(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
