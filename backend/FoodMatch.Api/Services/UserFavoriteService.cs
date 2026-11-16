
using FoodMatch.Api.DTOs;
using FoodMatch.Api.Models.Entities;
using FoodMatch.Api.Repositories;

namespace FoodMatch.Api.Services
{
    public class UserFavoriteService
    {
        private readonly IUserFavoriteRepository _userFavoriteRepository;
        private readonly IUserRepository _userRepository;
        private readonly IRecipeRepository _recipeRepository;

        public UserFavoriteService(
            IUserFavoriteRepository userFavoriteRepository,
            IUserRepository userRepository,
            IRecipeRepository recipeRepository)
        {
            _userFavoriteRepository = userFavoriteRepository;
            _userRepository = userRepository;
            _recipeRepository = recipeRepository;
        }

        // Obtener los favoritos de un usuario
        public async Task<List<UserFavoriteResponseDTO>> GetByUserId(int userId)
        {
            var favorites = await _userFavoriteRepository.GetByUserId(userId);

            return favorites.Select(favorite => new UserFavoriteResponseDTO
            {
                RecipeId = favorite.RecipeId,
                RecipeName = favorite.Recipe.Name,
                Description = favorite.Recipe.Description,
                ImageUrl = favorite.Recipe.ImageUrl,
                PreparationTimeMinutes = favorite.Recipe.PreparationTimeMinutes,
                Servings = favorite.Recipe.Servings
            }).ToList();
        }

        // Agregar una receta a favoritos
        public async Task AddFavorite(int userId, int recipeId)
        {
            var user = await _userRepository.GetById(userId);

            if (user == null)
            {
                throw new KeyNotFoundException("El usuario no existe.");
            }

            var recipe = await _recipeRepository.GetById(recipeId);

            if (recipe == null)
            {
                throw new KeyNotFoundException("La receta no existe.");
            }

            var existing = await _userFavoriteRepository.GetByUserAndRecipe(
                userId,
                recipeId
            );

            if (existing != null)
            {
                throw new InvalidOperationException("La receta ya está en favoritos.");
            }

            var favorite = new UserFavorite
            {
                UserId = userId,
                RecipeId = recipeId
            };

            await _userFavoriteRepository.Add(favorite);
        }

        // Eliminar una receta de favoritos
        public async Task<bool> DeleteFavorite(int userId, int recipeId)
        {
            var existing = await _userFavoriteRepository.GetByUserAndRecipe(
                userId,
                recipeId
            );

            if (existing == null)
            {
                return false;
            }

            await _userFavoriteRepository.Delete(existing);

            return true;
        }
    }
}
