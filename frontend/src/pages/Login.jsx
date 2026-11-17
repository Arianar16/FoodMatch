
import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('No se pudo iniciar sesión. Revisá tus datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#102D26] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-[#367A62] bg-[#173B32] p-8 shadow-2xl shadow-black/30 sm:p-10"
      >
        <div className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-[#96E6B3] bg-[#00A878] text-5xl font-black text-[#102D26] shadow-lg shadow-[#00A878]/25">
            F
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-[#F2FFF6]">
            FoodMatch
          </h1>

          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#00A878]" />

          <h2 className="mt-5 text-2xl font-bold text-[#96E6B3]">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm text-[#C1D9CC]">
            Ingresá a tu cuenta y descubrí nuevas recetas.
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-[#E7F5EC]">
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[#367A62] bg-[#102D26] px-4 py-3 text-[#F2FFF6] outline-none transition placeholder:text-[#8EAA9B] focus:border-[#96E6B3] focus:ring-2 focus:ring-[#00A878]/30"
            placeholder="tu@email.com"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-[#E7F5EC]">
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[#367A62] bg-[#102D26] px-4 py-3 text-[#F2FFF6] outline-none transition placeholder:text-[#8EAA9B] focus:border-[#96E6B3] focus:ring-2 focus:ring-[#00A878]/30"
            placeholder="Tu contraseña"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-[#B95F52] bg-[#572D2A] p-3 text-sm font-semibold text-[#FFD6CE]">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-[#96E6B3] py-3.5 font-extrabold text-[#102D26] shadow-lg shadow-[#00A878]/20 transition hover:-translate-y-0.5 hover:bg-[#B4F5C9] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="mt-8 text-center text-sm text-[#C1D9CC]">
          ¿No tenés una cuenta?{' '}
          <Link
            to="/registro"
            className="font-bold text-[#96E6B3] transition hover:text-white hover:underline"
          >
            Registrate
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
