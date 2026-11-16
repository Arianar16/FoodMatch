
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // POST: api/User/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDTO dto)
        {
            var user = await _userService.Register(dto);

            if (user == null)
            {
                return BadRequest(
                    "Ya existe una cuenta registrada con ese correo electrónico."
                );
            }

            return StatusCode(201, user);
        }

        // POST: api/User/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO dto)
        {
            var user = await _userService.Login(dto);

            if (user == null)
            {
                return Unauthorized(
                    "Correo electrónico o contraseña incorrectos."
                );
            }

            return Ok(user);
        }

        // GET: api/User/profile
        // Consultar el perfil del usuario autenticado
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out int userId))
            {
                return Unauthorized();
            }

            var profile = await _userService.GetProfile(userId);

            if (profile == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            return Ok(profile);
        }

        // PUT: api/User/profile
        // Modificar el perfil del usuario autenticado
        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(
            UserUpdateProfileDTO dto)
        {
            if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out int userId))
            {
                return Unauthorized();
            }

            try
            {
                var profile = await _userService.UpdateProfile(
                    userId,
                    dto
                );

                if (profile == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                return Ok(profile);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }
    }
}
