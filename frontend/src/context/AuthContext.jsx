
import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import {
  login as loginService,
  register as registerService,
} from '../services/authService'
import api from '../services/api'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  const login = async (email, password) => {
    const data = await loginService(email, password)

    const receivedToken = data.token
    const userData = {
      id: data.id,
      userName: data.userName,
      email: data.email,
    }

    localStorage.setItem('token', receivedToken)
    localStorage.setItem('user', JSON.stringify(userData))

    setToken(receivedToken)
    setUser(userData)

    return userData
  }

  const register = async (userName, email, password) => {
    return await registerService(userName, email, password)
  }

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
