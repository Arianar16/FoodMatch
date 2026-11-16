
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getRecipes = async () => {
      try {
        const response = await api.get('/Recipe')
        setRecipes(response.data)
      } catch {
        setError('No se pudieron cargar las recetas.')
      } finally {
        setLoading(false)
      }
    }

    getRecipes()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Recetas</h1>
            <p className="mt-2 text-gray-400">
              Descubrí nuevas comidas y preparaciones.
            </p>
          </div>

          <Link
            to="/"
            className="text-emerald-400 hover:underline"
          >
            Volver al inicio
          </Link>
        </div>

        {loading && (
          <p className="mt-10 text-gray-400">Cargando recetas...</p>
        )}

        {error && (
          <p className="mt-10 text-red-400">{error}</p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <p className="mt-10 text-gray-400">
            Todavía no hay recetas cargadas.
          </p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <article
                key={recipe.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-5">
                  <h2 className="text-xl font-semibold text-white">
                    {recipe.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    {recipe.description}
                  </p>

                  <div className="mt-4 flex gap-4 text-sm text-gray-400">
                    <span>
                      ⏱️ {recipe.preparationTimeMinutes} min
                    </span>
                    <span>
                      🍽️ {recipe.servings} porciones
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Recipes
