
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;
using System.Security.Cryptography;

namespace FoodMatch.Api.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponseDTO?> Register(UserRegisterDTO dto)
        {
            var existingUser = await _userRepository.GetByEmail(dto.Email);

            if (existingUser != null)
            {
                return null;
            }

            byte[] salt = RandomNumberGenerator.GetBytes(16);

            byte[] passwordHash = Rfc2898DeriveBytes.Pbkdf2(
                dto.Password,
                salt,
                600000,
                HashAlgorithmName.SHA256,
                32
            );

            var user = new User
            {
                UserName = dto.UserName,
                Email = dto.Email,
                PasswordHash = Convert.ToBase64String(salt) + "." +
                               Convert.ToBase64String(passwordHash)
            };

            await _userRepository.Add(user);

            return new UserResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsActive = user.IsActive
            };
        }
    }
}
