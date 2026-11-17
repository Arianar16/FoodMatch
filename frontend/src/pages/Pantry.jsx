
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/useAuth'
import api from '../services/api'

function Pantry() {
  const { user } = useAuth()

  const [ingredients, setIngredients] = useState([])
  const [availableIngredients, setAvailableIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadPantry = async () => {
    try {
      const response = await api.get(`/UserIngredient/${user.id}`)
      setIngredients(response.data)
      setError('')
    } catch {
      setError('No se pudo cargar tu alacena.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        const [pantryResponse, ingredientResponse] = await Promise.all([
          api.get(`/UserIngredient/${user.id}`),
          api.get('/Ingredient'),
        ])

        if (active) {
          setIngredients(pantryResponse.data)
          setAvailableIngredients(ingredientResponse.data)
          setError('')
        }
      } catch {
        if (active) {
          setError('No se pudieron cargar los ingredientes.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [user.id])

  const handleAdd = async (e) => {
    e.preventDefault()

    if (!selectedIngredient) return

    setSaving(true)
    setError('')
    setMessage('')

    try {
      await api.post(`/UserIngredient/${user.id}/${selectedIngredient}`)

      setSelectedIngredient('')
      setMessage('El ingrediente se agregó a tu alacena correctamente.')

      await loadPantry()
    } catch {
      setError('No se pudo agregar el ingrediente.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (ingredientId) => {
    setError('')
    setMessage('')

    try {
      await api.delete(`/UserIngredient/${user.id}/${ingredientId}`)

      setMessage('El ingrediente se quitó de tu alacena.')
      await loadPantry()
    } catch {
      setError('No se pudo quitar el ingrediente.')
    }
  }

  const pantryIds = ingredients.map(
    (ingredient) => ingredient.ingredientId
  )

  const ingredientsToAdd = availableIngredients.filter(
    (ingredient) => !pantryIds.includes(ingredient.id)
  )

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar />

      <main className="ml-64 min-h-screen px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          {/* Encabezado */}
          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#00A878]">
              Organizá tus alimentos
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#173B32]">
              Mi alacena
            </h1>

            <p className="mt-3 max-w-xl text-[#82796D]">
              Llevá un registro de los ingredientes que tenés disponibles
              y tenelos organizados para tus próximas preparaciones.
            </p>
          </div>

          {/* Resumen */}
          <section className="mb-8 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#173B32] p-7 text-white shadow-lg">
            <div>
              <p className="text-sm font-semibold text-[#B7E36A]">
                Tu alacena personal
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                Todo lo que tenés a mano
              </h2>

              <p className="mt-2 text-sm text-white/70">
                Administrá tus ingredientes desde un solo lugar.
              </p>
            </div>

            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white/10">
              <span className="text-3xl font-extrabold text-[#B7E36A]">
                {loading ? '...' : ingredients.length}
              </span>

              <span className="text-xs font-semibold text-white/80">
                Ingredientes
              </span>
            </div>
          </section>

          {/* Formulario para agregar */}
          <section className="mb-10 overflow-hidden rounded-3xl border border-[#EEE5D7] bg-white shadow-sm">
            <div className="border-b border-[#F0EADF] bg-[#F5F8EE] px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B7E36A] text-2xl">
                  🧺
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#173B32]">
                    Agregar a mi alacena
                  </h2>

                  <p className="mt-1 text-sm text-[#82796D]">
                    Seleccioná un ingrediente del catálogo disponible.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAdd} className="p-7">
              <div className="flex flex-col gap-4 sm:flex-row">
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                  required
                  className="min-w-0 flex-1 rounded-xl border border-[#E8E0D3] bg-[#FFFCF6] px-4 py-3 text-[#173B32] outline-none transition focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                >
                  <option value="">Seleccioná un ingrediente</option>

                  {ingredientsToAdd.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} - {ingredient.category}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={saving || !selectedIngredient}
                  className="rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white shadow-md shadow-[#00A878]/15 transition hover:bg-[#008F67] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Agregando...' : '+ Agregar'}
                </button>
              </div>

              {ingredientsToAdd.length === 0 && !loading && (
                <p className="mt-3 text-sm text-[#82796D]">
                  Ya tenés todos los ingredientes disponibles en tu alacena.
                </p>
              )}
            </form>
          </section>

          {/* Mensajes */}
          {message && (
            <p className="mb-5 rounded-xl bg-[#E7F3E5] px-4 py-3 text-sm font-semibold text-[#008F67]">
              {message}
            </p>
          )}

          {error && (
            <p className="mb-5 rounded-xl bg-[#FFF0EB] px-4 py-3 text-sm font-semibold text-[#A64B38]">
              {error}
            </p>
          )}

          {/* Listado */}
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-[#173B32]">
                  Mis ingredientes
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Estos son los ingredientes que tenés registrados.
                </p>
              </div>

              {!loading && (
                <span className="rounded-full bg-[#E7F3E5] px-4 py-2 text-sm font-bold text-[#008F67]">
                  {ingredients.length} en mi alacena
                </span>
              )}
            </div>

            {loading && (
              <div className="rounded-3xl border border-[#EEE5D7] bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#DDE9D8] border-t-[#00A878]"></div>

                <p className="font-semibold text-[#173B32]">
                  Cargando tu alacena...
                </p>
              </div>
            )}

            {!loading && ingredients.length === 0 && !error && (
              <div className="rounded-3xl border border-[#EEE5D7] bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 text-5xl">🧺</div>

                <h3 className="text-xl font-bold text-[#173B32]">
                  Tu alacena está vacía
                </h3>

                <p className="mt-2 text-[#82796D]">
                  Agregá ingredientes del catálogo para empezar a organizar
                  tus alimentos.
                </p>
              </div>
            )}

            {!loading && ingredients.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ingredients.map((ingredient) => (
                  <article
                    key={ingredient.ingredientId}
                    className="group rounded-2xl border border-[#EEE5D7] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5E9] text-2xl transition group-hover:bg-[#E7F3E5]">
                        🥬
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-extrabold text-[#173B32]">
                          {ingredient.ingredientName}
                        </h3>

                        <span className="mt-2 inline-block rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#80642A]">
                          {ingredient.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(ingredient.ingredientId)}
                      className="mt-5 w-full rounded-xl border border-[#FFD4C9] bg-[#FFF0EB] px-4 py-2.5 text-sm font-bold text-[#A64B38] transition hover:bg-[#FFE3DA]"
                    >
                      Quitar de mi alacena
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}

export default Pantry
