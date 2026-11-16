
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Mvc;

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
                return BadRequest("Ya existe una cuenta registrada con ese correo electrónico.");
            }

            return StatusCode(201, user);
        }
    }
}
