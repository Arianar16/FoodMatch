using System.ComponentModel.DataAnnotations;

namespace FoodMatch.Api.DTOs
{
    public class RecipeCreateDTO
    {
        [Required]
        [MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Instructions { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public int PreparationTimeMinutes { get; set; }

        public int Servings { get; set; }
    }
}