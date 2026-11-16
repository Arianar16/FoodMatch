
using System.ComponentModel.DataAnnotations;

namespace FoodMatch.Api.DTOs
{
    public class RecipeIngredientCreateDTO
    {
        [Required]
        public int IngredientId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Quantity { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string Unit { get; set; } = string.Empty;
    }
}
