
using FoodMatch.Api.Data;
using FoodMatch.Api.Repositories;
using FoodMatch.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Registrar controladores
builder.Services.AddControllers();

// Configurar conexión con SQL Server
builder.Services.AddDbContext<FoodMatchDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

// Registrar repositorios
builder.Services.AddScoped<IRecipeRepository, RecipeRepository>();
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();
builder.Services.AddScoped<IRecipeIngredientRepository, RecipeIngredientRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Registrar servicios
builder.Services.AddScoped<RecipeService>();
builder.Services.AddScoped<IngredientService>();
builder.Services.AddScoped<RecipeIngredientService>();
builder.Services.AddScoped<UserService>();

// Configurar Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configurar Swagger en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
