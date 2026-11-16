
using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class IngredientRepository : IIngredientRepository
    {
        private readonly FoodMatchDbContext _context;

        public IngredientRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<List<Ingredient>> GetAll()
        {
            return await _context.Ingredients.ToListAsync();
        }

        public async Task<Ingredient?> GetById(int id)
        {
            return await _context.Ingredients.FindAsync(id);
        }

        public async Task Add(Ingredient ingredient)
        {
            await _context.Ingredients.AddAsync(ingredient);
            await _context.SaveChangesAsync();
        }

        public async Task Update(Ingredient ingredient)
        {
            _context.Ingredients.Update(ingredient);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Ingredient ingredient)
        {
            _context.Ingredients.Remove(ingredient);
            await _context.SaveChangesAsync();
        }
    }
}
