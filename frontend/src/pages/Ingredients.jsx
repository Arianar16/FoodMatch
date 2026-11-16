
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Ingredients() {
  const [ingredients, setIngredients] = useState([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
    async function fetchIngredients() {
      try {
        const response = await api.get('/Ingredient')
        setIngredients(response.data)
      } catch {
        setError('No se pudieron cargar los ingredientes.')
      } finally {
        setLoading(false)
      }
    }

    fetchIngredients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      await api.post('/Ingredient', {
        name,
        category,
      })

      setName('')
      setCategory('')
      await loadIngredients()
    } catch {
      setError('No se pudo agregar el ingrediente. Verificá tus permisos.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Ingredientes
            </h1>
            <p className="mt-2 text-gray-400">
              Explorá y administrá los ingredientes de FoodMatch.
            </p>
          </div>

          <Link to="/" className="text-emerald-400 hover:underline">
            Volver al inicio
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold text-white">
            Agregar ingrediente
          </h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nombre del ingrediente"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />

            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              placeholder="Categoría (ej. Verduras)"
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : '+ Agregar ingrediente'}
          </button>
        </form>

        {error && (
          <p className="mt-5 text-sm text-red-400">{error}</p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Ingredientes disponibles
          </h2>

          {loading && (
            <p className="mt-5 text-gray-400">Cargando ingredientes...</p>
          )}

          {!loading && !error && ingredients.length === 0 && (
            <p className="mt-5 text-gray-400">
              Todavía no hay ingredientes registrados.
            </p>
          )}

          {!loading && ingredients.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ingredient) => (
                <article
                  key={ingredient.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="font-semibold text-white">
                    {ingredient.name}
                  </h3>

                  <p className="mt-2 text-sm text-emerald-400">
                    {ingredient.category}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Ingredients
