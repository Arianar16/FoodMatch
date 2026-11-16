using System.ComponentModel.DataAnnotations;

namespace FoodMatch.Api.DTOs
{
    public class UserUpdateProfileDTO
    {
        [Required]
        [MaxLength(80)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;
    }
}