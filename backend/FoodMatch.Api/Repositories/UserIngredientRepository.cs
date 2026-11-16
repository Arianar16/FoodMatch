using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class UserIngredientRepository : IUserIngredientRepository
    {
        private readonly FoodMatchDbContext _context;

        public UserIngredientRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserIngredient>> GetByUserId(int userId)
        {
            return await _context.UserIngredients
                .Include(ui => ui.Ingredient)
                .Where(ui => ui.UserId == userId)
                .ToListAsync();
        }

        public async Task<UserIngredient?> GetByUserAndIngredient(int userId, int ingredientId)
        {
            return await _context.UserIngredients
                .FirstOrDefaultAsync(ui =>
                    ui.UserId == userId &&
                    ui.IngredientId == ingredientId);
        }

        public async Task Add(UserIngredient userIngredient)
        {
            await _context.UserIngredients.AddAsync(userIngredient);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(UserIngredient userIngredient)
        {
            _context.UserIngredients.Remove(userIngredient);
            await _context.SaveChangesAsync();
        }
    }
}
