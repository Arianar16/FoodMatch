using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IRecipeRepository
    {
        Task<List<Recipe>> GetAll();

        Task<Recipe?> GetById(int id);

        Task Add(Recipe recipe);

        Task Update(Recipe recipe);

        Task Delete(Recipe recipe);
    }
}