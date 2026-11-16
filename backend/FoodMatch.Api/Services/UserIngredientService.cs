
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class UserIngredientService
    {
        private readonly IUserIngredientRepository _userIngredientRepository;
        private readonly IUserRepository _userRepository;
        private readonly IIngredientRepository _ingredientRepository;

        public UserIngredientService(
            IUserIngredientRepository userIngredientRepository,
            IUserRepository userRepository,
            IIngredientRepository ingredientRepository)
        {
            _userIngredientRepository = userIngredientRepository;
            _userRepository = userRepository;
            _ingredientRepository = ingredientRepository;
        }

        // Obtener los ingredientes de la alacena de un usuario
        public async Task<List<UserIngredientResponseDTO>> GetByUserId(int userId)
        {
            var ingredients = await _userIngredientRepository.GetByUserId(userId);

            return ingredients.Select(item => new UserIngredientResponseDTO
            {
                IngredientId = item.IngredientId,
                IngredientName = item.Ingredient.Name,
                Category = item.Ingredient.Category
            }).ToList();
        }

        // Agregar un ingrediente a la alacena
        public async Task AddIngredient(int userId, int ingredientId)
        {
            var user = await _userRepository.GetById(userId);
            var ingredient = await _ingredientRepository.GetById(ingredientId);

            if (user == null)
            {
                throw new KeyNotFoundException("El usuario no existe.");
            }

            if (ingredient == null)
            {
                throw new KeyNotFoundException("El ingrediente no existe.");
            }

            var existing = await _userIngredientRepository.GetByUserAndIngredient(
                userId,
                ingredientId
            );

            if (existing != null)
            {
                throw new InvalidOperationException("El ingrediente ya está en la alacena.");
            }

            var userIngredient = new UserIngredient
            {
                UserId = userId,
                IngredientId = ingredientId
            };

            await _userIngredientRepository.Add(userIngredient);
        }

        // Eliminar un ingrediente de la alacena
        public async Task<bool> DeleteIngredient(int userId, int ingredientId)
        {
            var existing = await _userIngredientRepository.GetByUserAndIngredient(
                userId,
                ingredientId
            );

            if (existing == null)
            {
                return false;
            }

            await _userIngredientRepository.Delete(existing);

            return true;
        }
    }
}
