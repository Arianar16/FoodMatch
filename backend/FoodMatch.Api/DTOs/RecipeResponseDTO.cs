namespace FoodMatch.Api.DTOs
{
    public class RecipeResponseDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public int PreparationTimeMinutes { get; set; }

        public int Servings { get; set; }

        public bool IsActive { get; set; }
    }
}