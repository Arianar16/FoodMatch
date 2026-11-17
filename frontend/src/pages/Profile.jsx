
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { useAuth } from '../context/useAuth'

function Profile() {
  const { updateUser } = useAuth()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true

    const getProfile = async () => {
      try {
        const response = await api.get('/User/profile')

        if (active) {
          setUserName(response.data.userName)
          setEmail(response.data.email)
        }
      } catch {
        if (active) {
          setError('No se pudieron cargar tus datos.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    getProfile()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api.put('/User/profile', {
        userName,
        email,
      })

      const updatedUser = {
        id: response.data.id,
        userName: response.data.userName,
        email: response.data.email,
      }

      setUserName(updatedUser.userName)
      setEmail(updatedUser.email)
      updateUser(updatedUser)

      setMessage('Tus datos se actualizaron correctamente.')
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Ese correo electrónico ya está registrado.')
      } else {
        setError('No se pudieron actualizar tus datos.')
      }
    } finally {
      setSaving(false)
    }
  }

  const initial = userName.trim().charAt(0).toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-[#96E6B3]">
      <Navbar />

      <main className="ml-64 min-h-screen px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-4xl">

          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-sm font-medium text-[#31594C] transition-colors hover:text-[#00A878]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#31594C]/25 transition-all group-hover:border-[#00A878] group-hover:bg-[#00A878]/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              >
                <path d="M19 12H5" />
                <path d="m12 19-7-7 7-7" />
              </svg>
            </span>
            Volver al inicio
          </Link>

          <div className="mt-9">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#008F67]">
              Mi espacio personal
            </span>

            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#173B32]">
              Mi perfil
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-[#31594C]">
              Administrá tu información personal y mantené tus datos actualizados.
            </p>
          </div>

          <div className="mt-9 overflow-hidden rounded-4xl border border-[#31594C]/10 bg-[#FFF3D6] shadow-xl shadow-[#173B32]/10">

            <div className="relative overflow-hidden bg-[#173B32] px-8 py-9 sm:px-10">
              <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-30 border-[#96E6B3]/10" />
              <div className="absolute -bottom-24 right-36 h-48 w-48 rounded-full bg-[#00A878]/10" />

              <div className="relative flex flex-col items-center gap-5 sm:flex-row">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-[#96E6B3]/30 bg-[#00A878] text-4xl font-extrabold text-white shadow-lg">
                  {initial}
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#96E6B3]">
                    Cuenta personal
                  </span>

                  <h2 className="mt-2 text-2xl font-extrabold text-[#FFF3D6]">
                    {userName || 'Tu perfil'}
                  </h2>

                  <p className="mt-1 text-sm text-[#B9D8C5]">
                    Tu información en FoodMatch
                  </p>
                </div>

                <div className="sm:ml-auto">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#96E6B3]/20 bg-[#96E6B3]/10 px-4 py-2 text-xs font-semibold text-[#96E6B3]">
                    <span className="h-2 w-2 rounded-full bg-[#96E6B3]" />
                    Mi cuenta
                  </span>
                </div>
              </div>
            </div>

            <div className="p-7 sm:p-10">
              <div className="mb-8">
                <h3 className="text-xl font-extrabold text-[#173B32]">
                  Datos personales
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[#64756D]">
                  Desde acá podés consultar y modificar los datos asociados a tu cuenta.
                </p>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#00A878]/20 border-t-[#00A878]" />
                  <p className="text-sm font-medium text-[#31594C]">
                    Cargando tu perfil...
                  </p>
                </div>
              )}

              {!loading && (
                <form onSubmit={handleSubmit} className="space-y-6">

                  <div>
                    <label
                      htmlFor="userName"
                      className="mb-2 block text-sm font-bold text-[#173B32]"
                    >
                      Nombre de usuario
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#00A878]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <circle cx="12" cy="8" r="4" />
                          <path d="M5 21a7 7 0 0 1 14 0" />
                        </svg>
                      </span>

                      <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                        maxLength={80}
                        required
                        className="w-full rounded-2xl border border-[#D8D0BE] bg-white/70 py-4 pl-12 pr-4 text-[#173B32] outline-none transition placeholder:text-[#9AA69D] focus:border-[#00A878] focus:bg-white focus:ring-4 focus:ring-[#00A878]/10"
                        placeholder="Ingresá tu nombre de usuario"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-[#173B32]"
                    >
                      Correo electrónico
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#00A878]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </span>

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        maxLength={150}
                        required
                        className="w-full rounded-2xl border border-[#D8D0BE] bg-white/70 py-4 pl-12 pr-4 text-[#173B32] outline-none transition placeholder:text-[#9AA69D] focus:border-[#00A878] focus:bg-white focus:ring-4 focus:ring-[#00A878]/10"
                        placeholder="Ingresá tu correo electrónico"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-[#FF7557]/20 bg-[#FF7557]/10 px-5 py-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#A63D2B]"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v4" />
                        <path d="M12 16h.01" />
                      </svg>

                      <p className="text-sm font-medium text-[#A63D2B]">
                        {error}
                      </p>
                    </div>
                  )}

                  {message && (
                    <div className="flex items-start gap-3 rounded-2xl border border-[#00A878]/20 bg-[#00A878]/10 px-5 py-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#176044]"
                      >
                        <path d="m5 12 4 4L19 6" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>

                      <p className="text-sm font-medium text-[#176044]">
                        {message}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-4 border-t border-[#E9E0D1] pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-relaxed text-[#64756D]">
                      Los cambios se guardarán en tu cuenta.
                    </p>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00A878] px-7 py-4 font-bold text-white shadow-md shadow-[#00A878]/20 transition hover:-translate-y-0.5 hover:bg-[#008F67] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {saving ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                          >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                            <path d="M17 21v-8H7v8" />
                            <path d="M7 3v5h8" />
                          </svg>
                          Guardar cambios
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[#31594C]/80">
            FoodMatch · Tu alimentación, organizada en un solo lugar.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Profile
