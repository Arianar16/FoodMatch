
namespace FoodMatch.Api.DTOs
{
    public class UserFavoriteResponseDTO
    {
        public int RecipeId { get; set; }
        public string RecipeName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public int PreparationTimeMinutes { get; set; }
        public int Servings { get; set; }
    }
}
