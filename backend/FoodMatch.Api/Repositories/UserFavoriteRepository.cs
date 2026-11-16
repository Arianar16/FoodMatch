using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class UserFavoriteRepository : IUserFavoriteRepository
    {
        private readonly FoodMatchDbContext _context;

        public UserFavoriteRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserFavorite>> GetByUserId(int userId)
        {
            return await _context.UserFavorites
                .Include(uf => uf.Recipe)
                .Where(uf => uf.UserId == userId)
                .ToListAsync();
        }

        public async Task<UserFavorite?> GetByUserAndRecipe(int userId, int recipeId)
        {
            return await _context.UserFavorites
                .FirstOrDefaultAsync(uf =>
                    uf.UserId == userId &&
                    uf.RecipeId == recipeId);
        }

        public async Task Add(UserFavorite favorite)
        {
            await _context.UserFavorites.AddAsync(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(UserFavorite favorite)
        {
            _context.UserFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }
    }
}