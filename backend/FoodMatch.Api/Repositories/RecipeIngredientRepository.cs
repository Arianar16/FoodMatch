
using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class RecipeIngredientRepository : IRecipeIngredientRepository
    {
        private readonly FoodMatchDbContext _context;

        public RecipeIngredientRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<List<RecipeIngredient>> GetByRecipeId(int recipeId)
        {
            return await _context.RecipeIngredients
                .Include(ri => ri.Ingredient)
                .Where(ri => ri.RecipeId == recipeId)
                .ToListAsync();
        }

        public async Task Add(RecipeIngredient recipeIngredient)
        {
            await _context.RecipeIngredients.AddAsync(recipeIngredient);
            await _context.SaveChangesAsync();
        }
    }
}
