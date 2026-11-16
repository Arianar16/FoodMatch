
using FoodMatch.Api.Models.Entities;

namespace FoodMatch.Api.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetById(int id);

        Task<User?> GetByEmail(string email);

        Task Add(User user);
    }
}
