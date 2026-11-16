using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class UserFavoriteService
    {
        private readonly IUserFavoriteRepository _userFavoriteRepository;

        public UserFavoriteService(IUserFavoriteRepository userFavoriteRepository)
        {
            _userFavoriteRepository = userFavoriteRepository;
        }

        public async Task<List<UserFavorite>> GetByUserId(int userId)
        {
            return await _userFavoriteRepository.GetByUserId(userId);
        }

        public async Task<bool> AddFavorite(int userId, int recipeId)
        {
            var existing = await _userFavoriteRepository.GetByUserAndRecipe(
                userId,
                recipeId
            );

            if (existing != null)
            {
                return false;
            }

            var favorite = new UserFavorite
            {
                UserId = userId,
                RecipeId = recipeId
            };

            await _userFavoriteRepository.Add(favorite);

            return true;
        }

        public async Task<bool> DeleteFavorite(int userId, int recipeId)
        {
            var existing = await _userFavoriteRepository.GetByUserAndRecipe(
                userId,
                recipeId
            );

            if (existing == null)
            {
                return false;
            }

            await _userFavoriteRepository.Delete(existing);

            return true;
        }
    }
}