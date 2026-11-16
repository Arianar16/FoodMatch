
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function RecipeDetail() {
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const recipeResponse = await api.get(`/Recipe/${id}`)
        const ingredientsResponse = await api.get(
          `/recipes/${id}/ingredients`
        )

        setRecipe(recipeResponse.data)
        setIngredients(ingredientsResponse.data)
      } catch {
        setError('No se pudo cargar la información de la receta.')
      } finally {
        setLoading(false)
      }
    }

    getRecipe()
  }, [id])

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/recetas"
          className="text-emerald-400 hover:underline"
        >
          ← Volver a recetas
        </Link>

        {loading && (
          <p className="mt-8 text-gray-400">Cargando receta...</p>
        )}

        {error && (
          <p className="mt-8 text-red-400">{error}</p>
        )}

        {!loading && !error && recipe && (
          <article className="mt-8">
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full max-h-96 rounded-2xl object-cover"
              />
            )}

            <h1 className="mt-8 text-3xl font-bold text-white">
              {recipe.name}
            </h1>

            <p className="mt-4 text-gray-300">
              {recipe.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-6 text-gray-300">
              <span>
                ⏱️ {recipe.preparationTimeMinutes} minutos
              </span>
              <span>
                🍽️ {recipe.servings} porciones
              </span>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold text-white">
                Ingredientes
              </h2>

              {ingredients.length === 0 ? (
                <p className="mt-4 text-gray-400">
                  Esta receta todavía no tiene ingredientes registrados.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {ingredients.map((ingredient) => (
                    <li
                      key={ingredient.ingredientId}
                      className="rounded-lg bg-slate-900 p-4 text-gray-300"
                    >
                      <span className="font-medium text-white">
                        {ingredient.ingredientName}
                      </span>
                      {' - '}
                      {ingredient.quantity} {ingredient.unit}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold text-white">
                Preparación
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-300">
                {recipe.instructions || 'No hay instrucciones registradas.'}
              </p>
            </section>
          </article>
        )}
      </main>
    </div>
  )
}

export default RecipeDetail
