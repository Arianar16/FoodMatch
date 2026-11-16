
namespace FoodMatch.Api.DTOs
{
    public class RecipeIngredientResponseDTO
    {
        public int IngredientId { get; set; }

        public string IngredientName { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string Quantity { get; set; } = string.Empty;

        public string Unit { get; set; } = string.Empty;
    }
}
