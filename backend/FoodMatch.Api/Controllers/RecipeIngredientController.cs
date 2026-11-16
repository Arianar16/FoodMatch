
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/recipes/{recipeId}/ingredients")]
    public class RecipeIngredientController : ControllerBase
    {
        private readonly RecipeIngredientService _recipeIngredientService;

        public RecipeIngredientController(
            RecipeIngredientService recipeIngredientService)
        {
            _recipeIngredientService = recipeIngredientService;
        }

        // GET: api/recipes/1/ingredients
        [HttpGet]
        public async Task<IActionResult> GetByRecipeId(int recipeId)
        {
            var ingredients =
                await _recipeIngredientService.GetByRecipeId(recipeId);

            if (ingredients == null)
            {
                return NotFound("La receta no existe.");
            }

            return Ok(ingredients);
        }

        // POST: api/recipes/1/ingredients
        [HttpPost]
        public async Task<IActionResult> Add(
            int recipeId,
            RecipeIngredientCreateDTO dto)
        {
            try
            {
                var result =
                    await _recipeIngredientService.Add(recipeId, dto);

                if (result == null)
                {
                    return NotFound("La receta o el ingrediente no existe.");
                }

                return Created(
                    $"/api/recipes/{recipeId}/ingredients",
                    result
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
