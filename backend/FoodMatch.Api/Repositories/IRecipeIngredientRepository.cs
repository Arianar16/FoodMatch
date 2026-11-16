
using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IRecipeIngredientRepository
    {
        Task<List<RecipeIngredient>> GetByRecipeId(int recipeId);

        Task Add(RecipeIngredient recipeIngredient);
    }
}
