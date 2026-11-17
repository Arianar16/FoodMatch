
using System.Text.Json;
using FoodMatch.Api.Data;
using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Services
{
    public class MealDbImportService
    {
        private readonly HttpClient _httpClient;
        private readonly FoodMatchDbContext _context;

        private const string ApiUrl =
            "https://www.themealdb.com/api/json/v1/1/";

        public MealDbImportService(
            HttpClient httpClient,
            FoodMatchDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        public async Task<int> ImportRecipesAsync()
        {
            int totalRecipes = await _context.Recipes.CountAsync();

            // Ya se importaron las 40 recetas iniciales.
            // No volver a importar recetas de TheMealDB.
            if (totalRecipes >= 41)
            {
                return 0;
            }

            int importedCount = 0;

            for (char letter = 'a'; letter <= 'z' && importedCount < 40; letter++)
            {
                string url = $"{ApiUrl}search.php?f={letter}";

                HttpResponseMessage response = await _httpClient.GetAsync(url);

                response.EnsureSuccessStatusCode();

                string json = await response.Content.ReadAsStringAsync();

                using JsonDocument document = JsonDocument.Parse(json);

                if (!document.RootElement.TryGetProperty("meals", out JsonElement meals))
                {
                    continue;
                }

                if (meals.ValueKind != JsonValueKind.Array)
                {
                    continue;
                }

                foreach (JsonElement meal in meals.EnumerateArray())
                {
                    if (importedCount >= 40)
                    {
                        break;
                    }

                    string name = GetText(meal, "strMeal");

                    if (string.IsNullOrWhiteSpace(name))
                    {
                        continue;
                    }

                    bool alreadyExists = await _context.Recipes
                        .AnyAsync(recipe =>
                            recipe.Name.ToLower() == name.ToLower());

                    if (alreadyExists)
                    {
                        continue;
                    }

                    string category = GetText(meal, "strCategory");
                    string area = GetText(meal, "strArea");

                    string description = $"Receta de {category}. Origen: {area}.";

                    if (description.Length > 500)
                    {
                        description = description.Substring(0, 500);
                    }

                    Recipe recipe = new Recipe
                    {
                        Name = name.Length > 120 ? name.Substring(0, 120) : name,
                        Description = description,
                        Instructions = GetText(meal, "strInstructions"),
                        ImageUrl = GetText(meal, "strMealThumb"),
                        PreparationTimeMinutes = 30,
                        Servings = 2,
                        IsActive = true
                    };

                    _context.Recipes.Add(recipe);

                    await _context.SaveChangesAsync();

                    HashSet<int> addedIngredients = new HashSet<int>();

                    for (int i = 1; i <= 20; i++)
                    {
                        string ingredientName = GetText(meal, $"strIngredient{i}");
                        string measure = GetText(meal, $"strMeasure{i}");

                        if (string.IsNullOrWhiteSpace(ingredientName))
                        {
                            continue;
                        }

                        Ingredient? ingredient = await _context.Ingredients
                            .FirstOrDefaultAsync(item =>
                                item.Name.ToLower() == ingredientName.ToLower());

                        if (ingredient == null)
                        {
                            ingredient = new Ingredient
                            {
                                Name = ingredientName.Length > 100
                                    ? ingredientName.Substring(0, 100)
                                    : ingredientName,
                                Category = "General",
                                IsActive = true
                            };

                            _context.Ingredients.Add(ingredient);

                            await _context.SaveChangesAsync();
                        }

                        if (!addedIngredients.Add(ingredient.Id))
                        {
                            continue;
                        }

                        (string quantity, string unit) = ParseMeasure(measure);

                        RecipeIngredient recipeIngredient = new RecipeIngredient
                        {
                            RecipeId = recipe.Id,
                            IngredientId = ingredient.Id,
                            Quantity = quantity,
                            Unit = unit
                        };

                        _context.RecipeIngredients.Add(recipeIngredient);
                    }

                    await _context.SaveChangesAsync();

                    importedCount++;
                }
            }

            return importedCount;
        }

        private static string GetText(JsonElement element, string property)
        {
            if (element.TryGetProperty(property, out JsonElement value) &&
                value.ValueKind == JsonValueKind.String)
            {
                return value.GetString()?.Trim() ?? string.Empty;
            }

            return string.Empty;
        }

        private static (string quantity, string unit) ParseMeasure(string measure)
        {
            if (string.IsNullOrWhiteSpace(measure))
            {
                return ("1", "unidad");
            }

            string[] parts = measure.Trim().Split(
                ' ',
                2,
                StringSplitOptions.RemoveEmptyEntries
            );

            string quantity = parts[0];
            string unit = parts.Length > 1 ? parts[1] : "unidad";

            if (quantity.Length > 50)
            {
                quantity = quantity.Substring(0, 50);
            }

            if (unit.Length > 30)
            {
                unit = unit.Substring(0, 30);
            }

            return (quantity, unit);
        }
    }
}
