
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(userName, email, password)
      navigate('/login')
    } catch {
      setError('No se pudo crear la cuenta. Revisá los datos ingresados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-emerald-500 text-center">
          FoodMatch
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-white text-center">
          Crear cuenta
        </h2>

        <div className="mt-8">
          <label className="block text-sm text-gray-300 mb-2">
            Nombre de usuario
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="Tu nombre"
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm text-gray-300 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="tu@email.com"
          />
        </div>

        <div className="mt-5">
          <label className="block text-sm text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-emerald-500"
            placeholder="Elegí una contraseña"
          />
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tenés una cuenta?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
