using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using AnaOSProject.Custom;
using AnaOSProject.Models;
using AnaOSProject.Interfaces;
using AnaOSProject.Repositories;
using AnaOSProject.Services;
using AnaOSProject.Data;
using AnaOSProject.Middleware;

// Configurar Npgsql para manejar DateTime sin zona horaria correctamente
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ── Puerto dinámico (Railway inyecta PORT) ──────────────────────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// ── Controladores ───────────────────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// ── Swagger (solo disponible en development) ─────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AnaOS API",
        Version = "v1",
        Description = "Documentación de la API AnaOS"
    });

    var securitySchema = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Introduce el token JWT con el prefijo **Bearer**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", securitySchema);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securitySchema, new[] { "Bearer" } }
    });
});

// ── Base de datos: soporta DATABASE_URL de Railway (postgresql://...) ────────
var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
string connectionString;

if (!string.IsNullOrEmpty(databaseUrl))
{
    // Railway entrega: postgresql://user:pass@host:port/database
    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':');
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("No se encontró la cadena de conexión a la base de datos.");
}

builder.Services.AddDbContext<AnaOSDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// ── Inyección de dependencias ────────────────────────────────────────────────
builder.Services.AddScoped<Utilidades>();

// Repositorios
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<ICooperativaRepository, CooperativaRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IAgenciaRepository, AgenciaRepository>();
builder.Services.AddScoped<ICuentaRepository, CuentaRepository>();
builder.Services.AddScoped<IPlanSuscripcionRepository, PlanSuscripcionRepository>();
builder.Services.AddScoped<ISuscripcionRepository, SuscripcionRepository>();
builder.Services.AddScoped<IHistorialSuscripcionRepository, HistorialSuscripcionRepository>();

// Servicios
builder.Services.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));
builder.Services.AddScoped<ICooperativaService, CooperativaService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IAgenciaService, AgenciaService>();
builder.Services.AddScoped<ICuentaService, CuentaService>();
builder.Services.AddScoped<IPlanSuscripcionService, PlanSuscripcionService>();
builder.Services.AddScoped<ISuscripcionService, SuscripcionService>();

// ── JWT: prioridad env var JWT_KEY > appsettings.json ───────────────────────
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
    ?? builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT_KEY no está configurado.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ── CORS: soporta ALLOWED_ORIGINS env var para producción ────────────────────
var allowedOrigins = new List<string>
{
    "http://localhost:8080",
    "http://localhost:5173",
    "http://localhost:3000"
};

var allowedOriginsEnv = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS");
if (!string.IsNullOrEmpty(allowedOriginsEnv))
{
    allowedOrigins.AddRange(allowedOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ── Auto-migración al arrancar (necesario en Railway) ─────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AnaOSDbContext>();
    db.Database.EnsureCreated();
}

// ── Pipeline HTTP ─────────────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
}

// IMPORTANTE: CORS antes de autenticación
app.UseCors("AllowFrontend");

// IMPORTANTE: autenticación antes de autorización
app.UseAuthentication();
app.UseAuthorization();

// Middleware personalizado para autorización por roles
app.UseRoleAuthorization();

app.MapControllers();

app.Run();
