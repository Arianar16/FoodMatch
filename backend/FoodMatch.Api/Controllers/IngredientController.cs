
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IngredientController : ControllerBase
    {
        private readonly IngredientService _ingredientService;

        public IngredientController(IngredientService ingredientService)
        {
            _ingredientService = ingredientService;
        }

        // GET: api/Ingredient
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ingredients = await _ingredientService.GetAll();

            return Ok(ingredients);
        }

        // GET: api/Ingredient/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ingredient = await _ingredientService.GetById(id);

            if (ingredient == null)
            {
                return NotFound();
            }

            return Ok(ingredient);
        }

        // POST: api/Ingredient
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(IngredientCreateDTO dto)
        {
            var ingredient = await _ingredientService.Create(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = ingredient.Id },
                ingredient
            );
        }

        // PUT: api/Ingredient/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IngredientCreateDTO dto)
        {
            var updated = await _ingredientService.Update(id, dto);

            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Ingredient/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _ingredientService.Delete(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
