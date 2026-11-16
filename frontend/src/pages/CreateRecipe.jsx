
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

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <Link
          to="/recetas"
          className="text-emerald-400 hover:underline"
        >
          ← Volver a recetas
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-white">
          Agregar receta
        </h1>

        <p className="mt-2 text-gray-400">
          Completá los datos y seleccioná los ingredientes necesarios.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Nombre de la receta
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Ejemplo: Tarta de verduras"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Contá brevemente de qué trata la receta."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              URL de la imagen
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Tiempo de preparación (minutos)
            </label>
            <input
              type="number"
              min="1"
              value={preparationTimeMinutes}
              onChange={(e) => setPreparationTimeMinutes(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Cantidad de porciones
            </label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />
          </div>

          <section className="border-t border-slate-700 pt-6">
            <h2 className="text-xl font-semibold text-white">
              Ingredientes
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Seleccioná cada ingrediente e indicá su cantidad.
            </p>

            {availableIngredients.length === 0 && (
              <p className="mt-4 text-sm text-yellow-400">
                No hay ingredientes disponibles. Primero deben estar registrados en FoodMatch.
              </p>
            )}

            {selectedIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <select
                  value={ingredient.ingredientId}
                  onChange={(e) =>
                    handleIngredientChange(index, 'ingredientId', e.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white"
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
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white"
                />

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleIngredientChange(index, 'unit', e.target.value)
                    }
                    placeholder="Unidad (g, ml, unidad)"
                    className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-3 text-white"
                  />

                  {selectedIngredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="rounded-lg bg-red-500 px-3 text-white hover:bg-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-4 rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10"
            >
              + Agregar otro ingrediente
            </button>
          </section>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Instrucciones de preparación
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows="6"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="Escribí los pasos para preparar la receta."
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar receta'}
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateRecipe
