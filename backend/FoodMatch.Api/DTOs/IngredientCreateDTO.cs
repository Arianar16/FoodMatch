
using System.ComponentModel.DataAnnotations;

namespace FoodMatch.Api.DTOs
{
    public class IngredientCreateDTO
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
    }
}
