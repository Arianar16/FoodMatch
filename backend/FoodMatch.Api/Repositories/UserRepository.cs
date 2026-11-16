
using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly FoodMatchDbContext _context;

        public UserRepository(FoodMatchDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetById(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(user => user.Email == email);
        }

        public async Task Add(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task Update(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
