
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserFavoriteController : ControllerBase
    {
        private readonly UserFavoriteService _userFavoriteService;

        public UserFavoriteController(UserFavoriteService userFavoriteService)
        {
            _userFavoriteService = userFavoriteService;
        }

        // Obtener los favoritos del usuario autenticado
        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out int userId))
            {
                return Unauthorized();
            }

            var favorites = await _userFavoriteService.GetByUserId(userId);

            return Ok(favorites);
        }

        // Agregar una receta a favoritos
        [HttpPost("{recipeId}")]
        public async Task<IActionResult> AddFavorite(int recipeId)
        {
            if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out int userId))
            {
                return Unauthorized();
            }

            if (recipeId <= 0)
            {
                return BadRequest("El identificador de la receta no es válido.");
            }

            try
            {
                await _userFavoriteService.AddFavorite(userId, recipeId);

                return Ok("Receta agregada a favoritos correctamente.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // Eliminar una receta de favoritos
        [HttpDelete("{recipeId}")]
        public async Task<IActionResult> DeleteFavorite(int recipeId)
        {
            if (!int.TryParse(
                User.FindFirstValue(ClaimTypes.NameIdentifier),
                out int userId))
            {
                return Unauthorized();
            }

            if (recipeId <= 0)
            {
                return BadRequest("El identificador de la receta no es válido.");
            }

            var deleted = await _userFavoriteService.DeleteFavorite(
                userId,
                recipeId
            );

            if (!deleted)
            {
                return NotFound("La receta no está en favoritos.");
            }

            return Ok("Receta eliminada de favoritos correctamente.");
        }
    }
}
