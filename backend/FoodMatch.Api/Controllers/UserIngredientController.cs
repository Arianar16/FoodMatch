using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserIngredientController : ControllerBase
    {
        private readonly UserIngredientService _userIngredientService;

        public UserIngredientController(UserIngredientService userIngredientService)
        {
            _userIngredientService = userIngredientService;
        }

        // Obtener los ingredientes de un usuario
        [HttpGet("{userId}")]
        public async Task<ActionResult<List<UserIngredient>>> GetByUserId(int userId)
        {
            var ingredients = await _userIngredientService.GetByUserId(userId);

            return Ok(ingredients);
        }

        // Agregar un ingrediente a la alacena
        [HttpPost("{userId}/{ingredientId}")]
        public async Task<IActionResult> AddIngredient(int userId, int ingredientId)
        {
            var result = await _userIngredientService.AddIngredient(userId, ingredientId);

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Este ingrediente ya está en la alacena del usuario."
                });
            }

            return Ok(new
            {
                message = "Ingrediente agregado correctamente a la alacena."
            });
        }

        // Eliminar un ingrediente de la alacena
        [HttpDelete("{userId}/{ingredientId}")]
        public async Task<IActionResult> DeleteIngredient(int userId, int ingredientId)
        {
            var result = await _userIngredientService.DeleteIngredient(userId, ingredientId);

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
    }
}