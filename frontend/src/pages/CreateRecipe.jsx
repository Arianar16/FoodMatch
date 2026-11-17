
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { getIngredients } from '../services/ingredientService'

function CreateRecipe() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [preparationTimeMinutes, setPreparationTimeMinutes] = useState('')
  const [servings, setServings] = useState('')

  const [availableIngredients, setAvailableIngredients] = useState([])
  const [selectedIngredients, setSelectedIngredients] = useState([
    { ingredientId: '', quantity: '', unit: '' },
  ])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        const data = await getIngredients()
        setAvailableIngredients(data)
      } catch {
        setError('No se pudieron cargar los ingredientes disponibles.')
      }
    }

    loadIngredients()
  }, [])

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...selectedIngredients]
    updatedIngredients[index][field] = value
    setSelectedIngredients(updatedIngredients)
  }

  const addIngredient = () => {
    setSelectedIngredients([
      ...selectedIngredients,
      { ingredientId: '', quantity: '', unit: '' },
    ])
  }

  const removeIngredient = (index) => {
    setSelectedIngredients(
      selectedIngredients.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const recipeResponse = await api.post('/Recipe', {
        name,
        description,
        instructions,
        imageUrl,
        preparationTimeMinutes: Number(preparationTimeMinutes),
        servings: Number(servings),
      })

      const recipeId = recipeResponse.data.id

      const validIngredients = selectedIngredients.filter(
        (ingredient) =>
          ingredient.ingredientId &&
          ingredient.quantity &&
          ingredient.unit.trim()
      )

      for (const ingredient of validIngredients) {
        await api.post(`/recipes/${recipeId}/ingredients`, {
          ingredientId: Number(ingredient.ingredientId),
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit,
        })
      }

      navigate('/recetas')
    } catch {
      setError('No se pudo guardar la receta. Verificá los datos y tus permisos.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle =
    "w-full rounded-xl border border-[#E5E7D9] bg-[#FFFDF8] px-4 py-3 text-[#173B32] outline-none transition placeholder:text-[#A49B8E] focus:border-[#00A878] focus:ring-2 focus:ring-[#00A878]/15"

  const labelStyle =
    "mb-2 block text-sm font-bold text-[#31594C]"

  return (
    <div className="min-h-screen bg-[#FFF9EF]">
      <Navbar />

      <main className="min-h-screen px-4 py-10 sm:px-6 lg:ml-64 lg:px-10">
        <div className="mx-auto w-full max-w-4xl">

          <div className="mb-8 text-center">
            <Link
              to="/recetas"
              className="mb-7 inline-flex items-center gap-2 rounded-xl text-sm font-bold text-[#00A878] transition hover:text-[#008F67] hover:underline"
            >
              ← Volver a recetas
            </Link>

            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-[#00A878]">
              Compartí tus ideas
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#173B32] sm:text-4xl">
              Agregar receta
            </h1>

            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-[#82796D]">
              Compartí tus preparaciones favoritas con la comunidad de FoodMatch.
              Completá los datos y agregá los ingredientes necesarios.
            </p>

            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#00A878]" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-[#EEE5D7] bg-white p-5 shadow-lg shadow-[#173B32]/5 sm:p-8 lg:p-10"
          >

            <section>
              <div className="mb-6 text-center">
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F3E5] text-[#00A878]">
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
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                  </svg>
                </span>

                <h2 className="text-xl font-extrabold text-[#173B32]">
                  Información de la receta
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Los datos principales de tu preparación.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>
                    Nombre de la receta
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputStyle}
                    placeholder="Ejemplo: Tarta de verduras"
                  />
                </div>

                <div>
                  <label className={labelStyle}>
                    Descripción
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="3"
                    className={inputStyle}
                    placeholder="Contá brevemente de qué trata la receta."
                  />
                </div>

                <div>
                  <label className={labelStyle}>
                    URL de la imagen
                  </label>

                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={inputStyle}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />

                  <p className="mt-2 text-xs text-[#82796D]">
                    Pegá el enlace de una imagen para identificar tu receta.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelStyle}>
                      Tiempo de preparación (minutos)
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={preparationTimeMinutes}
                      onChange={(e) => setPreparationTimeMinutes(e.target.value)}
                      required
                      className={inputStyle}
                      placeholder="Ejemplo: 30"
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Cantidad de porciones
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      required
                      className={inputStyle}
                      placeholder="Ejemplo: 4"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="border-t border-[#EEE5D7] pt-8">
              <div className="mb-6 text-center">
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F3E5] text-[#00A878]">
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
                    <path d="M3 3h18v18H3z" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                  </svg>
                </span>

                <h2 className="text-xl font-extrabold text-[#173B32]">
                  Ingredientes
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Seleccioná los ingredientes e indicá sus cantidades.
                </p>
              </div>

              {availableIngredients.length === 0 && (
                <p className="mb-5 rounded-xl border border-[#E8D9A9] bg-[#FFF8E5] p-4 text-sm font-medium text-[#92702D]">
                  No hay ingredientes disponibles. Primero deben estar registrados en FoodMatch.
                </p>
              )}

              <div className="space-y-4">
                {selectedIngredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#EEE5D7] bg-[#FFFDF8] p-4 sm:p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-[#173B32]">
                        Ingrediente {index + 1}
                      </span>

                      {selectedIngredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="rounded-lg px-3 py-2 text-xs font-bold text-[#C65B46] transition hover:bg-[#FFF0EB]"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <select
                        value={ingredient.ingredientId}
                        onChange={(e) =>
                          handleIngredientChange(index, 'ingredientId', e.target.value)
                        }
                        className={inputStyle}
                      >
                        <option value="">Seleccionar ingrediente</option>

                        {availableIngredients.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(index, 'quantity', e.target.value)
                        }
                        placeholder="Cantidad"
                        className={inputStyle}
                      />

                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(index, 'unit', e.target.value)
                        }
                        placeholder="Unidad (g, ml, unidad)"
                        className={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={addIngredient}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00A878] bg-[#E7F3E5] px-5 py-3 text-sm font-bold text-[#008F67] transition hover:bg-[#D8EDDA]"
                >
                  + Agregar otro ingrediente
                </button>
              </div>
            </section>

            <section className="border-t border-[#EEE5D7] pt-8">
              <div className="mb-6 text-center">
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E7F3E5] text-[#00A878]">
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
                    <path d="M4 5h16M4 12h16M4 19h10" />
                  </svg>
                </span>

                <h2 className="text-xl font-extrabold text-[#173B32]">
                  Preparación
                </h2>

                <p className="mt-1 text-sm text-[#82796D]">
                  Explicá paso a paso cómo se prepara.
                </p>
              </div>

              <div>
                <label className={labelStyle}>
                  Instrucciones de preparación
                </label>

                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                  rows="6"
                  className={inputStyle}
                  placeholder="Escribí los pasos para preparar la receta."
                />
              </div>
            </section>

            {error && (
              <p className="rounded-xl border border-[#F2C9BA] bg-[#FFF0EB] p-4 text-sm font-semibold text-[#A64B38]">
                {error}
              </p>
            )}

            <div className="border-t border-[#EEE5D7] pt-7 text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#00A878] px-6 py-4 font-extrabold text-white shadow-md shadow-[#00A878]/15 transition hover:-translate-y-0.5 hover:bg-[#008F67] disabled:cursor-not-allowed disabled:opacity-50 sm:w-2/3"
              >
                {loading ? 'Guardando receta...' : 'Guardar receta'}
              </button>

              <p className="mt-3 text-xs text-[#82796D]">
                Revisá los datos antes de compartir tu receta.
              </p>
            </div>
          </form>

        </div>
      </main>
    </div>
  )
}

export default CreateRecipe
