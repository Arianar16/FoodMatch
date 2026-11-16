
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly RecipeService _recipeService;

        public RecipeController(RecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        // GET: api/Recipe
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var recipes = await _recipeService.GetAll();

            return Ok(recipes);
        }

        // GET: api/Recipe/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var recipe = await _recipeService.GetById(id);

            if (recipe == null)
            {
                return NotFound();
            }

            return Ok(recipe);
        }

        // POST: api/Recipe
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(RecipeCreateDTO dto)
        {
            var recipe = await _recipeService.Create(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = recipe.Id },
                recipe
            );
        }

        // PUT: api/Recipe/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RecipeCreateDTO dto)
        {
            var updated = await _recipeService.Update(id, dto);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Recipe/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _recipeService.Delete(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
