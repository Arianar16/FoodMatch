using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodMatch.Api.Models.Entities
{
    public class UserFavorite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        public int RecipeId { get; set; }

        public User User { get; set; } = null!;

        public Recipe Recipe { get; set; } = null!;
    }
}