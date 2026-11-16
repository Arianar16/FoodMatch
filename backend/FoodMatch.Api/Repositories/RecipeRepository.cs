using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly FoodMatchDbContext _context;

        public RecipeRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<List<Recipe>> GetAll()
        {
            return await _context.Recipes.ToListAsync();
        }

        public async Task<Recipe?> GetById(int id)
        {
            return await _context.Recipes.FindAsync(id);
        }

        public async Task Add(Recipe recipe)
        {
            await _context.Recipes.AddAsync(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Recipe recipe)
        {
            _context.Recipes.Update(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Recipe recipe)
        {
            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
        }
    }
}