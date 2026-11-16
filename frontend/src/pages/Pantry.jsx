
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    async function fetchData() {
      try {
        const [pantryResponse, ingredientResponse] = await Promise.all([
          api.get(`/UserIngredient/${user.id}`),
          api.get('/Ingredient')
        ])

        setIngredients(pantryResponse.data)
        setAvailableIngredients(ingredientResponse.data)
      } catch {
        setError('No se pudieron cargar los ingredientes.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  const handleAdd = async (e) => {
    e.preventDefault()

    if (!selectedIngredient) return

    setSaving(true)
    setError('')

    try {
      await api.post(`/UserIngredient/${user.id}/${selectedIngredient}`)
      setSelectedIngredient('')
      await loadPantry()
    } catch {
      setError('No se pudo agregar el ingrediente.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (ingredientId) => {
    try {
      await api.delete(`/UserIngredient/${user.id}/${ingredientId}`)
      await loadPantry()
    } catch {
      setError('No se pudo quitar el ingrediente.')
    }
  }

  const pantryIds = ingredients.map((ingredient) => ingredient.ingredientId)

  const ingredientsToAdd = availableIngredients.filter(
    (ingredient) => !pantryIds.includes(ingredient.id)
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Mi alacena</h1>
            <p className="mt-2 text-gray-400">
              Administrá los ingredientes que tenés disponibles.
            </p>
          </div>

          <Link to="/" className="text-emerald-400 hover:underline">
            Volver al inicio
          </Link>
        </div>

        <form
          onSubmit={handleAdd}
          className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <h2 className="text-xl font-semibold text-white">
            Agregar ingrediente a mi alacena
          </h2>

          <div className="mt-5 flex flex-col sm:flex-row gap-4">
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              required
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
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
              className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {saving ? 'Agregando...' : '+ Agregar'}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-5 text-sm text-red-400">{error}</p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">
            Mis ingredientes
          </h2>

          {loading && (
            <p className="mt-5 text-gray-400">Cargando alacena...</p>
          )}

          {!loading && ingredients.length === 0 && !error && (
            <p className="mt-5 text-gray-400">
              Todavía no agregaste ingredientes a tu alacena.
            </p>
          )}

          {!loading && ingredients.length > 0 && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ingredients.map((ingredient) => (
                <article
                  key={ingredient.ingredientId}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="font-semibold text-white">
                    {ingredient.ingredientName}
                  </h3>

                  <p className="mt-2 text-sm text-emerald-400">
                    {ingredient.category}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleRemove(ingredient.ingredientId)}
                    className="mt-4 text-sm text-red-400 hover:text-red-300"
                  >
                    Quitar de mi alacena
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Pantry
