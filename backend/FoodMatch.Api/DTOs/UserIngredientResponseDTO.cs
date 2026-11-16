
namespace FoodMatch.Api.DTOs
{
    public class UserIngredientResponseDTO
    {
        public int IngredientId { get; set; }
        public string IngredientName { get; set; } = string.Empty;
        public string? Category { get; set; }
    }
}
