using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMatch.Api.Models.Entities
{
    public class UserIngredient
    {[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int IngredientId { get; set; }

        public User User { get; set; } = null!;

        public Ingredient Ingredient { get; set; } = null!;
    }
}