
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserIngredientController : ControllerBase
    {
        private readonly UserIngredientService _userIngredientService;

        public UserIngredientController(UserIngredientService userIngredientService)
        {
            _userIngredientService = userIngredientService;
        }

        // Obtener los ingredientes de un usuario
        [HttpGet("{userId}")]
        public async Task<ActionResult<List<UserIngredientResponseDTO>>> GetByUserId(int userId)
        {
            if (!IsUserAuthorized(userId))
            {
                return Forbid();
            }

            var ingredients = await _userIngredientService.GetByUserId(userId);

            return Ok(ingredients);
        }

        // Agregar un ingrediente a la alacena
        [HttpPost("{userId}/{ingredientId}")]
        public async Task<IActionResult> AddIngredient(int userId, int ingredientId)
        {
            if (!IsUserAuthorized(userId))
            {
                return Forbid();
            }

            if (ingredientId <= 0)
            {
                return BadRequest("El identificador del ingrediente no es válido.");
            }

            try
            {
                await _userIngredientService.AddIngredient(userId, ingredientId);

                return Ok(new
                {
                    message = "Ingrediente agregado correctamente a la alacena."
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        // Eliminar un ingrediente de la alacena
        [HttpDelete("{userId}/{ingredientId}")]
        public async Task<IActionResult> DeleteIngredient(int userId, int ingredientId)
        {
            if (!IsUserAuthorized(userId))
            {
                return Forbid();
            }

            if (ingredientId <= 0)
            {
                return BadRequest("El identificador del ingrediente no es válido.");
            }

            var result = await _userIngredientService.DeleteIngredient(
                userId,
                ingredientId
            );

            if (!result)
            {
                return NotFound(new
                {
                    message = "El ingrediente no está en la alacena del usuario."
                });
            }

            return Ok(new
            {
                message = "Ingrediente eliminado correctamente de la alacena."
            });
        }

        // Comprobar que el usuario autenticado sea dueño de la alacena
        private bool IsUserAuthorized(int userId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(userIdClaim, out int authenticatedUserId)
                   && authenticatedUserId == userId;
        }
    }
}
