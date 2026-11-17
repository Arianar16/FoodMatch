import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5218/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Agrega automáticamente el token JWT a cada solicitud.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token && !token.startsWith('demo-token')) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete config.headers.Authorization
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api