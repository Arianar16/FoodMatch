using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class UserIngredientService
    {
        private readonly IUserIngredientRepository _userIngredientRepository;

        public UserIngredientService(IUserIngredientRepository userIngredientRepository)
        {
            _userIngredientRepository = userIngredientRepository;
        }

        public async Task<List<UserIngredient>> GetByUserId(int userId)
        {
            return await _userIngredientRepository.GetByUserId(userId);
        }

        public async Task<bool> AddIngredient(int userId, int ingredientId)
        {
            var existing = await _userIngredientRepository.GetByUserAndIngredient(
                userId,
                ingredientId
            );

            if (existing != null)
            {
                return false;
            }

            var userIngredient = new UserIngredient
            {
                UserId = userId,
                IngredientId = ingredientId
            };

            await _userIngredientRepository.Add(userIngredient);

            return true;
        }

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
