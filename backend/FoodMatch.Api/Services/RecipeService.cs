using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class RecipeService
    {
        private readonly IRecipeRepository _recipeRepository;

        public RecipeService(IRecipeRepository recipeRepository)
        {
            _recipeRepository = recipeRepository;
        }

        public async Task<List<RecipeResponseDTO>> GetAll()
        {
            var recipes = await _recipeRepository.GetAll();

            return recipes.Select(recipe => new RecipeResponseDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                PreparationTimeMinutes = recipe.PreparationTimeMinutes,
                Servings = recipe.Servings,
                IsActive = recipe.IsActive
            }).ToList();
        }

        public async Task<RecipeResponseDTO?> GetById(int id)
        {
            var recipe = await _recipeRepository.GetById(id);

            if (recipe == null)
            {
                return null;
            }

            return new RecipeResponseDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                PreparationTimeMinutes = recipe.PreparationTimeMinutes,
                Servings = recipe.Servings,
                IsActive = recipe.IsActive
            };
        }

        public async Task<RecipeResponseDTO> Create(RecipeCreateDTO dto)
        {
            var recipe = new Recipe
            {
                Name = dto.Name,
                Description = dto.Description,
                Instructions = dto.Instructions,
                ImageUrl = dto.ImageUrl,
                PreparationTimeMinutes = dto.PreparationTimeMinutes,
                Servings = dto.Servings
            };

            await _recipeRepository.Add(recipe);

            return new RecipeResponseDTO
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Instructions = recipe.Instructions,
                ImageUrl = recipe.ImageUrl,
                PreparationTimeMinutes = recipe.PreparationTimeMinutes,
                Servings = recipe.Servings,
                IsActive = recipe.IsActive
            };
        }

        public async Task<bool> Update(int id, RecipeCreateDTO dto)
        {
            var recipe = await _recipeRepository.GetById(id);

            if (recipe == null)
            {
                return false;
            }

            recipe.Name = dto.Name;
            recipe.Description = dto.Description;
            recipe.Instructions = dto.Instructions;
            recipe.ImageUrl = dto.ImageUrl;
            recipe.PreparationTimeMinutes = dto.PreparationTimeMinutes;
            recipe.Servings = dto.Servings;

            await _recipeRepository.Update(recipe);

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var recipe = await _recipeRepository.GetById(id);

            if (recipe == null)
            {
                return false;
            }

            await _recipeRepository.Delete(recipe);

            return true;
        }
    }
}