
import api from './api'

export const getIngredients = async () => {
  const response = await api.get('/Ingredient')
  return response.data
}
