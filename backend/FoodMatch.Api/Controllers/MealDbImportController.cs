
using FoodMatch.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MealDbImportController : ControllerBase
    {
        private readonly MealDbImportService _importService;

        public MealDbImportController(MealDbImportService importService)
        {
            _importService = importService;
        }

        [HttpPost]
        public async Task<IActionResult> ImportRecipes()
        {
            int importedCount = await _importService.ImportRecipesAsync();

            return Ok(new
            {
                message = "Proceso de importación finalizado.",
                importedRecipes = importedCount
            });
        }
    }
}
