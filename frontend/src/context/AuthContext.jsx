import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import {
  login as loginService,
  register as registerService,
} from '../services/authService'
import api from '../services/api'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token')

    if (DEMO_MODE) {
      return savedToken?.startsWith('demo-token') ? savedToken : null
    }

    return savedToken
  })

  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (DEMO_MODE && !savedToken?.startsWith('demo-token')) {
      return null
    }

    return savedUser ? JSON.parse(savedUser) : null
  })

  useEffect(() => {
    if (DEMO_MODE) {
      delete api.defaults.headers.common.Authorization
    } else if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  const login = async (email, password) => {
    let receivedToken
    let userData

    if (DEMO_MODE) {
      receivedToken = 'demo-token'

      userData = {
        id: 1,
        userName: email.split('@')[0],
        email: email,
      }
    } else {
      const data = await loginService(email, password)

      receivedToken = data.token

      userData = {
        id: data.id,
        userName: data.userName,
        email: data.email,
      }
    }

    localStorage.setItem('token', receivedToken)
    localStorage.setItem('user', JSON.stringify(userData))

    setToken(receivedToken)
    setUser(userData)

    return userData
  }

  const register = async (userName, email, password) => {
    if (DEMO_MODE) {
      return {
        message: 'Registro de demostración completado',
      }
    }

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