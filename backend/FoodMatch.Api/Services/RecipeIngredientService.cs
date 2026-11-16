
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class RecipeIngredientService
    {
        private readonly IRecipeIngredientRepository _recipeIngredientRepository;
        private readonly IRecipeRepository _recipeRepository;
        private readonly IIngredientRepository _ingredientRepository;

        public RecipeIngredientService(
            IRecipeIngredientRepository recipeIngredientRepository,
            IRecipeRepository recipeRepository,
            IIngredientRepository ingredientRepository)
        {
            _recipeIngredientRepository = recipeIngredientRepository;
            _recipeRepository = recipeRepository;
            _ingredientRepository = ingredientRepository;
        }

        public async Task<List<RecipeIngredientResponseDTO>?> GetByRecipeId(int recipeId)
        {
            var recipe = await _recipeRepository.GetById(recipeId);

            if (recipe == null)
            {
                return null;
            }

            var recipeIngredients =
                await _recipeIngredientRepository.GetByRecipeId(recipeId);

            return recipeIngredients.Select(ri => new RecipeIngredientResponseDTO
            {
                IngredientId = ri.IngredientId,
                IngredientName = ri.Ingredient.Name,
                Category = ri.Ingredient.Category,
                Quantity = ri.Quantity,
                Unit = ri.Unit
            }).ToList();
        }

        public async Task<RecipeIngredientResponseDTO?> Add(
            int recipeId,
            RecipeIngredientCreateDTO dto)
        {
            var recipe = await _recipeRepository.GetById(recipeId);

            if (recipe == null)
            {
                return null;
            }

            var ingredient = await _ingredientRepository.GetById(dto.IngredientId);

            if (ingredient == null)
            {
                return null;
            }

            // Verificar si el ingrediente ya está asociado a la receta
            var existingIngredients =
                await _recipeIngredientRepository.GetByRecipeId(recipeId);

            if (existingIngredients.Any(ri => ri.IngredientId == dto.IngredientId))
            {
                throw new InvalidOperationException(
                    "Este ingrediente ya está asociado a la receta."
                );
            }

            var recipeIngredient = new RecipeIngredient
            {
                RecipeId = recipeId,
                IngredientId = dto.IngredientId,
                Quantity = dto.Quantity,
                Unit = dto.Unit
            };

            await _recipeIngredientRepository.Add(recipeIngredient);

            return new RecipeIngredientResponseDTO
            {
                IngredientId = ingredient.Id,
                IngredientName = ingredient.Name,
                Category = ingredient.Category,
                Quantity = dto.Quantity,
                Unit = dto.Unit
            };
        }
    }
}
