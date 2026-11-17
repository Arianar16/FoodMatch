
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'

function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const getRecipes = async () => {
      try {
        const response = await api.get('/Recipe')

        if (active) {
          setRecipes(response.data)
        }
      } catch {
        if (active) {
          setError('No se pudieron cargar las recetas. Intentá nuevamente.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    getRecipes()

    return () => {
      active = false
    }
  }, [])

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar />

      <main className="ml-0 min-h-screen px-4 py-7 sm:px-6 sm:py-8 md:ml-64 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#008F67]">
                Descubrí nuevas ideas
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#173B32] sm:text-4xl">
                Nuestras recetas
              </h1>

              <p className="mt-3 max-w-xl text-[#31594C]">
                Encontrá opciones para cocinar, explorá los ingredientes y
                descubrí nuevas preparaciones.
              </p>
            </div>

            <Link
              to="/recetas/nueva"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white shadow-md shadow-[#173B32]/10 transition hover:-translate-y-0.5 hover:bg-[#008F67] sm:w-auto"
            >
              <span className="text-xl">+</span>
              Crear receta
            </Link>
          </div>

          {!loading && !error && recipes.length > 0 && (
            <div className="mb-8">
              <div className="relative w-full max-w-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#008F67]"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar una receta por su nombre..."
                  className="w-full rounded-2xl border border-[#DCE5D8] bg-white py-4 pl-12 pr-12 text-[#173B32] shadow-sm outline-none transition placeholder:text-[#91A097] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64756D] transition hover:text-[#173B32]"
                    aria-label="Limpiar búsqueda"
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-3xl border border-[#31594C]/10 bg-[#FFF3D6] px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#B9D8C5] border-t-[#00A878]" />
              <p className="font-semibold text-[#173B32]">
                Cargando recetas...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-[#FF7557]/30 bg-[#FFF3D6] p-6 text-center">
              <p className="font-semibold text-[#A63D2B]">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && recipes.length === 0 && (
            <div className="rounded-3xl border border-[#E9E0D1] bg-[#FFF3D6] px-6 py-16 text-center shadow-sm">
              <div className="mb-4 text-5xl">🍲</div>

              <h2 className="text-2xl font-bold text-[#173B32]">
                Todavía no hay recetas
              </h2>

              <p className="mx-auto mt-2 max-w-md text-[#64756D]">
                Cuando se agreguen recetas al catálogo, van a aparecer en esta
                sección.
              </p>

              <Link
                to="/recetas/nueva"
                className="mt-6 inline-flex rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white transition hover:bg-[#008F67]"
              >
                Crear primera receta
              </Link>
            </div>
          )}

          {!loading && !error && recipes.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[#173B32]">
                  Explorá el catálogo
                </h2>

                <span className="rounded-full bg-[#FFF3D6] px-4 py-2 text-sm font-bold text-[#008F67]">
                  {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta' : 'recetas'}
                </span>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="rounded-3xl border border-[#E9E0D1] bg-[#FFF3D6] px-6 py-16 text-center shadow-sm">
                  <div className="mb-4 text-5xl">🔎</div>

                  <h2 className="text-2xl font-bold text-[#173B32]">
                    No encontramos recetas
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-[#64756D]">
                    No hay recetas que coincidan con "{search}". Probá con otro nombre.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-6 rounded-xl bg-[#00A878] px-6 py-3 font-bold text-white transition hover:bg-[#008F67]"
                  >
                    Ver todas las recetas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {filteredRecipes.map((recipe) => (
                    <article
                      key={recipe.id}
                      className="group min-w-0 overflow-hidden rounded-3xl border border-[#E9E0D1] bg-[#FFF3D6] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#DCEFE0] sm:h-52">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center text-[#31594C]">
                            <span className="text-5xl">🥗</span>
                            <span className="mt-2 text-sm font-semibold">
                              Sin imagen disponible
                            </span>
                          </div>
                        )}

                        <div className="absolute left-4 top-4 rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#173B32] shadow-sm">
                          FoodMatch
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <h3 className="mb-2 text-xl font-extrabold text-[#173B32]">
                          {recipe.name}
                        </h3>

                        <p className="mb-5 line-clamp-3 min-h-18 text-sm leading-6 text-[#64756D]">
                          {recipe.description || 'Una receta para descubrir y disfrutar.'}
                        </p>

                        <div className="mb-6 flex flex-wrap gap-4 border-t border-[#E9E0D1] pt-4 text-sm text-[#31594C]">
                          <span className="flex items-center gap-2">
                            <span>⏱️</span>
                            {recipe.preparationTimeMinutes
                              ? `${recipe.preparationTimeMinutes} min`
                              : 'Tiempo no indicado'}
                          </span>

                          <span className="flex items-center gap-2">
                            <span>🍽️</span>
                            {recipe.servings
                              ? `${recipe.servings} porciones`
                              : 'Porciones no indicadas'}
                          </span>
                        </div>

                        <Link
                          to={`/recetas/${recipe.id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#173B32] px-5 py-3 font-bold text-white transition hover:bg-[#245747]"
                        >
                          Ver receta
                          <span>→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Recipes
