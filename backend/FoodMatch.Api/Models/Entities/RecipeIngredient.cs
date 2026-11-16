using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMatch.Api.Models.Entities
{
    public class RecipeIngredient
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int RecipeId { get; set; }

        public int IngredientId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Quantity { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string Unit { get; set; } = string.Empty;

        public Recipe Recipe { get; set; } = null!;

        public Ingredient Ingredient { get; set; } = null!;
    }
}