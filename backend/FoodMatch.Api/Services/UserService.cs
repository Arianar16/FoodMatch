
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;
using FoodMatch.Api.Settings;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FoodMatch.Api.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;
        private readonly IConfiguration _configuration;

        public UserService(
            IUserRepository userRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;

            _jwtSettings = configuration
                .GetSection("JwtSettings")
                .Get<JwtSettings>() ?? new JwtSettings();
        }

        public async Task EnsureAdminAsync()
        {
            string? email = _configuration["AdminSettings:Email"];
            string? password = _configuration["AdminSettings:Password"];

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                throw new InvalidOperationException(
                    "Faltan las credenciales del administrador en User Secrets."
                );
            }

            var existingUser = await _userRepository.GetByEmail(email);

            if (existingUser != null)
            {
                return;
            }

            byte[] salt = RandomNumberGenerator.GetBytes(16);

            byte[] passwordHash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                600000,
                HashAlgorithmName.SHA256,
                32
            );

            var admin = new User
            {
                UserName = "Administrador",
                Email = email,
                PasswordHash = Convert.ToBase64String(salt) + "." +
                               Convert.ToBase64String(passwordHash),
                Role = "Admin",
                IsActive = true
            };

            await _userRepository.Add(admin);
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
                               Convert.ToBase64String(passwordHash),
                Role = "User"
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

        public async Task<UserLoginResponseDTO?> Login(UserLoginDTO dto)
        {
            var user = await _userRepository.GetByEmail(dto.Email);

            if (user == null || !user.IsActive)
            {
                return null;
            }

            string[] passwordParts = user.PasswordHash.Split('.');

            if (passwordParts.Length != 2)
            {
                return null;
            }

            byte[] salt = Convert.FromBase64String(passwordParts[0]);
            byte[] storedHash = Convert.FromBase64String(passwordParts[1]);

            byte[] enteredHash = Rfc2898DeriveBytes.Pbkdf2(
                dto.Password,
                salt,
                600000,
                HashAlgorithmName.SHA256,
                32
            );

            if (!CryptographicOperations.FixedTimeEquals(
                storedHash,
                enteredHash))
            {
                return null;
            }

            string role = string.IsNullOrWhiteSpace(user.Role)
                ? "User"
                : user.Role;

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    _jwtSettings.ExpirationMinutes
                ),
                signingCredentials: credentials
            );

            return new UserLoginResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}
