using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMatch.Api.Models.Entities
{
    public class Recipe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

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

        public bool IsActive { get; set; } = true;
    }
}