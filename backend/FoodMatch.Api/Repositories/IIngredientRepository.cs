
using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IIngredientRepository
    {
        Task<List<Ingredient>> GetAll();

        Task<Ingredient?> GetById(int id);

        Task<Ingredient?> GetByName(string name);

        Task Add(Ingredient ingredient);

        Task Update(Ingredient ingredient);

        Task Delete(Ingredient ingredient);
    }
}
