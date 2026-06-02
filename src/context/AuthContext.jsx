import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('sf_user')) } catch { return null }
  })
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('sf_token')
    if (!token) { setReady(true); return }
    authApi.me()
      .then(r => setUser(r.data))
      .catch(() => {
        localStorage.removeItem('sf_token')
        localStorage.removeItem('sf_user')
      })
      .finally(() => setReady(true))
  }, [])

  function persist(token, userData) {
    localStorage.setItem('sf_token', token)
    localStorage.setItem('sf_user', JSON.stringify(userData))
    setUser(userData)
  }

  async function login(email, password) {
    const r = await authApi.login({ email, password })
    persist(r.data.token, r.data.user)
    return r.data
  }

  async function signup(email, password, organizationName) {
    const r = await authApi.signup({ email, password, organizationName })
    persist(r.data.token, r.data.user)
    return r.data
  }

  function logout() {
    localStorage.removeItem('sf_token')
    localStorage.removeItem('sf_user')
    setUser(null)
  }

  function updateUser(patch) {
    setUser(prev => {
      const next = { ...prev, ...patch }
      localStorage.setItem('sf_user', JSON.stringify(next))
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
