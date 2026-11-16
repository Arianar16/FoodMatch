
import api from './api'

export const login = async (email, password) => {
  const response = await api.post('/User/login', {
    email,
    password,
  })

  return response.data
}

export const register = async (userName, email, password) => {
  const response = await api.post('/User/register', {
    userName,
    email,
    password,
  })

  return response.data
}
