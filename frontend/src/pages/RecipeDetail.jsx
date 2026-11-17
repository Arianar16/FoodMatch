
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function SectionIcon({ name, className = 'h-6 w-6' }) {
  const icons = {
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    servings: (
      <>
        <path d="M3 10h18l-2 10H5L3 10Z" />
        <path d="M7 10a5 5 0 0 1 10 0" />
        <path d="M8 5 6 3M16 5l2-2" />
      </>
    ),
    ingredients: (
      <>
        <path d="M20 4c-8 0-14 4-14 11a5 5 0 0 0 5 5c7 0 11-6 9-16Z" />
        <path d="M4 21c3-6 7-9 12-12" />
      </>
    ),
    preparation: (
      <>
        <path d="M4 19h16" />
        <path d="M6 19v-3a6 6 0 0 1 12 0v3" />
        <path d="M12 4v2M5 8l2 1M19 8l-2 1" />
        <path d="M9 13h.01M15 13h.01" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}

function RecipeDetail() {
  const { id } = useParams()

  const [recipe, setRecipe] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteStatusReady, setFavoriteStatusReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [error, setError] = useState('')
  const [ingredientsError, setIngredientsError] = useState('')
  const [favoriteMessage, setFavoriteMessage] = useState('')

  useEffect(() => {
    let active = true

    const getRecipe = async () => {
      const results = await Promise.allSettled([
        api.get(`/Recipe/${id}`),
        api.get(`/recipes/${id}/ingredients`),
        api.get('/UserFavorite'),
      ])

      if (!active) {
        return
      }

      const [recipeResult, ingredientsResult, favoritesResult] = results

      if (recipeResult.status === 'fulfilled') {
        setRecipe(recipeResult.value.data)
      } else {
        setError('No se pudo cargar la información de la receta.')
      }

      if (ingredientsResult.status === 'fulfilled') {
        setIngredients(ingredientsResult.value.data)
      } else {
        setIngredientsError('No se pudieron cargar los ingredientes.')
      }

      if (favoritesResult.status === 'fulfilled') {
        const favorites = favoritesResult.value.data

        setIsFavorite(
          Array.isArray(favorites) &&
            favorites.some(
              (favorite) => Number(favorite.recipeId) === Number(id)
            )
        )

        setFavoriteStatusReady(true)
      } else {
        setFavoriteMessage('No se pudo comprobar el estado de favoritos.')
      }

      setLoading(false)
    }

    getRecipe()

    return () => {
      active = false
    }
  }, [id])

  const handleFavorite = async () => {
    if (favoriteLoading || !favoriteStatusReady) {
      return
    }

    setFavoriteLoading(true)
    setFavoriteMessage('')

    const nextFavoriteState = !isFavorite

    try {
      if (nextFavoriteState) {
        await api.post(`/UserFavorite/${id}`)
      } else {
        await api.delete(`/UserFavorite/${id}`)
      }

      setIsFavorite(nextFavoriteState)

      setFavoriteMessage(
        nextFavoriteState
          ? 'Receta agregada a favoritos.'
          : 'Receta quitada de favoritos.'
      )

      try {
        const response = await api.get('/UserFavorite')
        const favorites = response.data

        if (Array.isArray(favorites)) {
          setIsFavorite(
            favorites.some(
              (favorite) => Number(favorite.recipeId) === Number(id)
            )
          )
        }
      } catch {
        setFavoriteMessage(
          'La operación se realizó, pero no se pudo actualizar la lista. Volvé a cargar la página para comprobarla.'
        )
      }
    } catch (requestError) {
      const status = requestError.response?.status
      const serverMessage =
        requestError.response?.data?.message ||
        requestError.response?.data?.title

      setFavoriteMessage(
        serverMessage ||
          (status
            ? `No se pudo actualizar favoritos. Error del servidor: ${status}.`
            : 'No se pudo conectar con el servidor para actualizar favoritos.')
      )
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#96E6B3]">
      <Navbar />

      <main className="ml-0 min-h-screen px-4 py-6 sm:px-6 md:ml-64 md:px-8 md:py-10 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/recetas"
            className="group inline-flex items-center gap-2.5 text-sm font-medium text-[#31594C] transition-colors hover:text-[#00A878]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#31594C]/25 transition-all group-hover:border-[#00A878] group-hover:bg-[#00A878]/10">
              <SectionIcon
                name="arrow"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              />
            </span>
            Volver a recetas
          </Link>

          {loading && (
            <div className="mt-6 rounded-3xl bg-[#FFF3D6] px-4 py-12 text-center shadow-sm sm:mt-8 sm:px-6 sm:py-16">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#B9D8C5] border-t-[#00A878]" />
              <p className="font-semibold text-[#173B32]">
                Cargando receta...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="mt-6 rounded-2xl border border-[#FF7557]/30 bg-[#FFF3D6] p-5 text-center sm:mt-8 sm:p-6">
              <p className="font-semibold text-[#A63D2B]">{error}</p>

              <Link
                to="/recetas"
                className="mt-4 inline-flex font-semibold text-[#008F67] hover:underline"
              >
                Volver al catálogo
              </Link>
            </div>
          )}

          {!loading && !error && recipe && (
            <article className="mt-6 overflow-hidden rounded-2xl border border-[#E9E0D1] bg-[#FFF3D6] shadow-lg sm:mt-8 sm:rounded-3xl">
              {recipe.imageUrl && (
                <div className="h-52 overflow-hidden sm:h-80 lg:h-96">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#008F67] sm:text-sm">
                      FoodMatch · Recetas
                    </p>

                    <h1 className="wrap-break-word text-2xl font-extrabold tracking-tight text-[#173B32] sm:text-3xl lg:text-4xl">
                      {recipe.name}
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={favoriteLoading || !favoriteStatusReady}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:shrink-0 sm:px-5 sm:text-base ${
                      isFavorite
                        ? 'border-[#FF7557]/40 bg-[#FF7557]/10 text-[#A63D2B] hover:bg-[#FF7557]/20'
                        : 'border-[#00A878]/30 bg-[#00A878]/10 text-[#176044] hover:bg-[#00A878]/20'
                    }`}
                  >
                    <SectionIcon
                      name="heart"
                      className={`h-5 w-5 ${isFavorite ? 'fill-[#FF7557]' : ''}`}
                    />

                    {favoriteLoading
                      ? 'Actualizando...'
                      : !favoriteStatusReady
                        ? 'Comprobando...'
                        : isFavorite
                          ? 'Quitar de favoritos'
                          : 'Agregar a favoritos'}
                  </button>
                </div>

                {favoriteMessage && (
                  <p className="mt-4 wrap-break-word rounded-xl bg-[#00A878]/10 px-4 py-3 text-sm font-medium text-[#176044]">
                    {favoriteMessage}
                  </p>
                )}

                {recipe.description && (
                  <p className="mt-5 leading-7 text-[#64756D] sm:mt-6">
                    {recipe.description}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#E8F3E5] p-3 sm:p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00A878]/15 text-[#176044] sm:h-11 sm:w-11">
                      <SectionIcon name="clock" className="h-6 w-6" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#64756D]">
                        Tiempo de preparación
                      </p>

                      <p className="font-bold text-[#173B32]">
                        {recipe.preparationTimeMinutes
                          ? `${recipe.preparationTimeMinutes} minutos`
                          : 'No indicado'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-[#E8F3E5] p-3 sm:p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00A878]/15 text-[#176044] sm:h-11 sm:w-11">
                      <SectionIcon name="servings" className="h-6 w-6" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#64756D]">
                        Porciones
                      </p>

                      <p className="font-bold text-[#173B32]">
                        {recipe.servings
                          ? `${recipe.servings} porciones`
                          : 'No indicadas'}
                      </p>
                    </div>
                  </div>
                </div>

                <section className="mt-8 sm:mt-10">
                  <div className="mb-4 flex items-center gap-3 sm:mb-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00A878]/15 text-[#176044]">
                      <SectionIcon name="ingredients" className="h-6 w-6" />
                    </span>

                    <h2 className="text-xl font-bold text-[#173B32] sm:text-2xl">
                      Ingredientes
                    </h2>
                  </div>

                  {ingredientsError ? (
                    <p className="rounded-xl bg-[#FF7557]/10 p-4 text-[#A63D2B]">
                      {ingredientsError}
                    </p>
                  ) : ingredients.length === 0 ? (
                    <p className="rounded-xl bg-white/50 p-4 text-[#64756D]">
                      Esta receta todavía no tiene ingredientes registrados.
                    </p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {ingredients.map((ingredient) => (
                        <li
                          key={ingredient.ingredientId}
                          className="flex items-center gap-3 rounded-xl border border-[#E9E0D1] bg-white/50 p-3 sm:p-4"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00A878]/15 text-[#176044]">
                            <SectionIcon name="check" className="h-4 w-4" />
                          </span>

                          <div className="min-w-0">
                            <p className="wrap-break-word font-semibold text-[#173B32]">
                              {ingredient.ingredientName}
                            </p>

                            <p className="text-sm text-[#64756D]">
                              {ingredient.quantity} {ingredient.unit}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="mt-8 border-t border-[#E9E0D1] pt-6 sm:mt-10 sm:pt-8">
                  <div className="mb-4 flex items-center gap-3 sm:mb-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF7557]/15 text-[#A63D2B]">
                      <SectionIcon name="preparation" className="h-6 w-6" />
                    </span>

                    <h2 className="text-xl font-bold text-[#173B32] sm:text-2xl">
                      Preparación
                    </h2>
                  </div>

                  <p className="whitespace-pre-line wrap-break-word leading-7 text-[#64756D] sm:leading-8">
                    {recipe.instructions || 'No hay instrucciones registradas.'}
                  </p>
                </section>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  )
}

export default RecipeDetail
