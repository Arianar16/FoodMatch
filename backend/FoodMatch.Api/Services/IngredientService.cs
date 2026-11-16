
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class IngredientService
    {
        private readonly IIngredientRepository _ingredientRepository;

        public IngredientService(IIngredientRepository ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        public async Task<List<IngredientResponseDTO>> GetAll()
        {
            var ingredients = await _ingredientRepository.GetAll();

            return ingredients.Select(ingredient => new IngredientResponseDTO
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                Category = ingredient.Category,
                IsActive = ingredient.IsActive
            }).ToList();
        }

        public async Task<IngredientResponseDTO?> GetById(int id)
        {
            var ingredient = await _ingredientRepository.GetById(id);

            if (ingredient == null)
            {
                return null;
            }

            return new IngredientResponseDTO
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                Category = ingredient.Category,
                IsActive = ingredient.IsActive
            };
        }

        public async Task<IngredientResponseDTO> Create(IngredientCreateDTO dto)
        {
            var ingredient = new Ingredient
            {
                Name = dto.Name,
                Category = dto.Category
            };

            await _ingredientRepository.Add(ingredient);

            return new IngredientResponseDTO
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                Category = ingredient.Category,
                IsActive = ingredient.IsActive
            };
        }

        public async Task<bool> Update(int id, IngredientCreateDTO dto)
        {
            var ingredient = await _ingredientRepository.GetById(id);

            if (ingredient == null)
            {
                return false;
            }

            ingredient.Name = dto.Name;
            ingredient.Category = dto.Category;

            await _ingredientRepository.Update(ingredient);

            return true;
        }

        public async Task<bool> Delete(int id)
        {
            var ingredient = await _ingredientRepository.GetById(id);

            if (ingredient == null)
            {
                return false;
            }

            await _ingredientRepository.Delete(ingredient);

            return true;
        }
    }
}
