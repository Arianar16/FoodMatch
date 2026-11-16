using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IUserFavoriteRepository
    {
        Task<List<UserFavorite>> GetByUserId(int userId);
        Task<UserFavorite?> GetByUserAndRecipe(int userId, int recipeId);
        Task Add(UserFavorite favorite);
        Task Delete(UserFavorite favorite);
    }
}