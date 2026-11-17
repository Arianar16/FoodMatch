
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingId, setRemovingId] = useState(null)

  const loadFavorites = async () => {
    try {
      const response = await api.get('/UserFavorite')
      setFavorites(response.data)
      setError('')
    } catch {
      setError('No se pudieron cargar tus recetas favoritas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchFavorites = async () => {
      try {
        const response = await api.get('/UserFavorite')

        if (active) {
          setFavorites(response.data)
          setError('')
        }
      } catch {
        if (active) {
          setError('No se pudieron cargar tus recetas favoritas.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchFavorites()

    return () => {
      active = false
    }
  }, [])

  const handleRemove = async (recipeId) => {
    setRemovingId(recipeId)
    setError('')

    try {
      await api.delete(`/UserFavorite/${recipeId}`)
      await loadFavorites()
    } catch {
      setError('No se pudo quitar la receta de favoritos.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar />

      <main className="ml-0 min-h-screen px-4 py-6 sm:px-6 md:ml-64 md:px-8 md:py-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#00A878] sm:text-sm">
                Tu colección personal
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#173B32] sm:text-4xl">
                  Mis favoritos
                </h1>

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#E7F3E5] text-[#00A878] sm:h-11 sm:w-11">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                </span>
              </div>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#82796D] sm:text-base">
                Guardá las recetas que más te gustan y encontralas fácilmente
                cuando quieras volver a prepararlas.
              </p>
            </div>

            <Link
              to="/recetas"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A878] px-5 py-3 font-bold text-white shadow-md shadow-[#00A878]/15 transition hover:-translate-y-0.5 hover:bg-[#008F67] sm:w-auto sm:shrink-0"
            >
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
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              Explorar recetas
            </Link>
          </div>

          {!loading && favorites.length > 0 && (
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:mb-7 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-extrabold text-[#173B32] sm:text-xl">
                  Tus recetas guardadas
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Todas tus recetas favoritas en un solo lugar.
                </p>
              </div>

              <span className="rounded-full bg-[#E7F3E5] px-4 py-2 text-sm font-bold text-[#008F67]">
                {favorites.length} {favorites.length === 1 ? 'receta' : 'recetas'}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-[#F2C9BA] bg-[#FFF0EB] p-4 text-sm font-semibold text-[#A64B38]">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-3xl border border-[#EEE5D7] bg-white px-4 py-12 text-center shadow-sm sm:px-6 sm:py-16">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#DDE9D8] border-t-[#00A878]" />

              <p className="font-semibold text-[#173B32]">
                Cargando tus favoritos...
              </p>
            </div>
          )}

          {!loading && favorites.length === 0 && !error && (
            <div className="rounded-3xl border border-[#EEE5D7] bg-white px-4 py-12 text-center shadow-sm sm:px-6 sm:py-16">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E7F3E5] text-[#00A878]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10"
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                </svg>
              </div>

              <h2 className="mt-6 text-xl font-extrabold text-[#173B32] sm:text-2xl">
                Todavía no tenés favoritos
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#82796D] sm:text-base">
                Explorá las recetas disponibles y guardá las que más te gusten
                para encontrarlas fácilmente después.
              </p>

              <Link
                to="/recetas"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#008F67]"
              >
                Explorar recetas
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}

          {!loading && favorites.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {favorites.map((recipe) => (
                <article
                  key={recipe.recipeId}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#EEE5D7] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden bg-[#F1F5E9]">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.recipeName}
                        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center text-[#00A878] sm:h-56">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-16 w-16"
                        >
                          <path d="M3 3v18h18" />
                          <path d="m19 9-5 5-4-4-5 5" />
                          <circle cx="17" cy="6" r="2" />
                        </svg>
                      </div>
                    )}

                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#00A878] shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-6">
                    <h2 className="wrap-break-word text-lg font-extrabold text-[#173B32] sm:text-xl">
                      {recipe.recipeName}
                    </h2>

                    <p className="mt-3 min-h-12 text-sm leading-relaxed text-[#82796D]">
                      {recipe.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#64756D] sm:gap-4">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 shrink-0 text-[#00A878]"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        {recipe.preparationTimeMinutes} min
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 shrink-0 text-[#00A878]"
                        >
                          <circle cx="9" cy="8" r="3" />
                          <path d="M3 20v-1a6 6 0 0 1 12 0v1" />
                          <path d="M16 5a3 3 0 0 1 0 6" />
                          <path d="M18 14a5 5 0 0 1 3 5v1" />
                        </svg>
                        {recipe.servings} porciones
                      </span>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE5D7] pt-5">
                      <Link
                        to={`/recetas/${recipe.recipeId}`}
                        className="inline-flex items-center gap-2 font-bold text-[#00A878] transition hover:text-[#008F67]"
                      >
                        Ver receta
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleRemove(recipe.recipeId)}
                        disabled={removingId === recipe.recipeId}
                        className="rounded-xl px-3 py-2 text-sm font-bold text-[#C65B46] transition hover:bg-[#FFF0EB] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {removingId === recipe.recipeId
                          ? 'Quitando...'
                          : 'Quitar'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Favorites
