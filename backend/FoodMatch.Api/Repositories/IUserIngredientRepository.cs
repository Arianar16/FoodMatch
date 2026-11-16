using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IUserIngredientRepository
    {
        Task<List<UserIngredient>> GetByUserId(int userId);

        Task<UserIngredient?> GetByUserAndIngredient(int userId, int ingredientId);

        Task Add(UserIngredient userIngredient);

        Task Delete(UserIngredient userIngredient);
    }
}
