
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadIngredients = async () => {
    try {
      const response = await api.get('/Ingredient')
      setIngredients(response.data)
      setError('')
    } catch {
      setError('No se pudieron cargar los ingredientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchIngredients = async () => {
      try {
        const response = await api.get('/Ingredient')

        if (active) {
          setIngredients(response.data)
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

    fetchIngredients()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      await api.post('/Ingredient', {
        name,
        category,
      })

      setName('')
      setCategory('')
      setMessage('El ingrediente se agregó correctamente.')

      await loadIngredients()
    } catch {
      setError('No se pudo agregar el ingrediente. Verificá tus permisos.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar />

      <main className="ml-64 min-h-screen px-8 py-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#00A878]">
              Conocé lo que podés cocinar
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#173B32]">
              Ingredientes
            </h1>

            <p className="mt-3 max-w-xl text-[#82796D]">
              Explorá los ingredientes disponibles y agregá nuevos elementos
              para ampliar las posibilidades de FoodMatch.
            </p>
          </div>

          <section className="mb-10 overflow-hidden rounded-3xl border border-[#EEE5D7] bg-white shadow-sm">
            <div className="border-b border-[#F0EADF] bg-[#F5F8EE] px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B7E36A] text-2xl">
                  🥑
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#173B32]">
                    Agregar ingrediente
                  </h2>

                  <p className="mt-1 text-sm text-[#82796D]">
                    Incorporá un ingrediente al catálogo.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="ingredientName"
                    className="mb-2 block text-sm font-bold text-[#173B32]"
                  >
                    Nombre del ingrediente
                  </label>

                  <input
                    id="ingredientName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ej. Tomate"
                    className="w-full rounded-xl border border-[#E8E0D3] bg-[#FFFCF6] px-4 py-3 text-[#173B32] outline-none transition placeholder:text-[#B0A697] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ingredientCategory"
                    className="mb-2 block text-sm font-bold text-[#173B32]"
                  >
                    Categoría
                  </label>

                  <input
                    id="ingredientCategory"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="Ej. Verduras"
                    className="w-full rounded-xl border border-[#E8E0D3] bg-[#FFFCF6] px-4 py-3 text-[#173B32] outline-none transition placeholder:text-[#B0A697] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white shadow-md shadow-[#00A878]/15 transition hover:-translate-y-0.5 hover:bg-[#008F67] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Guardando...' : '+ Agregar ingrediente'}
              </button>

              {message && (
                <p className="mt-4 rounded-xl bg-[#E7F3E5] px-4 py-3 text-sm font-semibold text-[#008F67]">
                  {message}
                </p>
              )}

              {error && (
                <p className="mt-4 rounded-xl bg-[#FFF0EB] px-4 py-3 text-sm font-semibold text-[#A64B38]">
                  {error}
                </p>
              )}
            </form>
          </section>

          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-[#173B32]">
                  Ingredientes disponibles
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Consultá los ingredientes registrados en FoodMatch.
                </p>
              </div>

              {!loading && (
                <span className="rounded-full bg-[#E7F3E5] px-4 py-2 text-sm font-bold text-[#008F67]">
                  {ingredients.length} ingredientes
                </span>
              )}
            </div>

            {loading && (
              <div className="rounded-3xl border border-[#EEE5D7] bg-white px-6 py-16 text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#DDE9D8] border-t-[#00A878]"></div>

                <p className="font-semibold text-[#173B32]">
                  Cargando ingredientes...
                </p>
              </div>
            )}

            {!loading && ingredients.length === 0 && !error && (
              <div className="rounded-3xl border border-[#EEE5D7] bg-white px-6 py-16 text-center shadow-sm">
                <div className="mb-4 text-5xl">🥕</div>

                <h3 className="text-xl font-bold text-[#173B32]">
                  Todavía no hay ingredientes
                </h3>

                <p className="mt-2 text-[#82796D]">
                  Agregá el primer ingrediente utilizando el formulario.
                </p>
              </div>
            )}

            {!loading && ingredients.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ingredients.map((ingredient) => (
                  <article
                    key={ingredient.id}
                    className="group flex items-center gap-4 rounded-2xl border border-[#EEE5D7] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F1F5E9] text-2xl transition group-hover:bg-[#E7F3E5]">
                      🥬
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-extrabold text-[#173B32]">
                        {ingredient.name}
                      </h3>

                      <span className="mt-2 inline-block rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#80642A]">
                        {ingredient.category}
                      </span>
                    </div>
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

export default Ingredients
