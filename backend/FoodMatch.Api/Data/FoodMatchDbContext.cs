using FoodMatch.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodMatch.Api.Data
{
    public class FoodMatchDbContext : DbContext
    {
        public FoodMatchDbContext(DbContextOptions<FoodMatchDbContext> options)
            : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<Ingredient> Ingredients { get; set; }

        public DbSet<RecipeIngredient> RecipeIngredients { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<UserIngredient> UserIngredients { get; set; }

        public DbSet<UserFavorite> UserFavorites { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Recipe)
                .WithMany()
                .HasForeignKey(ri => ri.RecipeId);

            modelBuilder.Entity<RecipeIngredient>()
                .HasOne(ri => ri.Ingredient)
                .WithMany()
                .HasForeignKey(ri => ri.IngredientId);

            modelBuilder.Entity<RecipeIngredient>()
                .HasIndex(ri => new { ri.RecipeId, ri.IngredientId })
                .IsUnique();

            modelBuilder.Entity<UserIngredient>()
                .HasOne(ui => ui.User)
                .WithMany()
                .HasForeignKey(ui => ui.UserId);

            modelBuilder.Entity<UserIngredient>()
                .HasOne(ui => ui.Ingredient)
                .WithMany()
                .HasForeignKey(ui => ui.IngredientId);

            modelBuilder.Entity<UserIngredient>()
                .HasIndex(ui => new { ui.UserId, ui.IngredientId })
                .IsUnique();

            modelBuilder.Entity<UserFavorite>()
                .HasOne(uf => uf.User)
                .WithMany()
                .HasForeignKey(uf => uf.UserId);

            modelBuilder.Entity<UserFavorite>()
                .HasOne(uf => uf.Recipe)
                .WithMany()
                .HasForeignKey(uf => uf.RecipeId);

            modelBuilder.Entity<UserFavorite>()
                .HasIndex(uf => new { uf.UserId, uf.RecipeId })
                .IsUnique();
        }
    }
}