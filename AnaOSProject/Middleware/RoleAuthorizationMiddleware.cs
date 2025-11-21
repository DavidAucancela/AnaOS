using System.Security.Claims;

namespace AnaOSProject.Middleware
{
    /// <summary>
    /// Middleware para validar permisos basados en roles y cooperativas
    /// </summary>
    public class RoleAuthorizationMiddleware
    {
        private readonly RequestDelegate _next;

        public RoleAuthorizationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Solo procesar si el usuario está autenticado
            if (context.User.Identity?.IsAuthenticated == true)
            {
                // Agregar información del usuario al contexto para fácil acceso
                var userIdClaim = context.User.FindFirst("idUsuario") ?? 
                                 context.User.FindFirst(ClaimTypes.NameIdentifier);
                var roleClaim = context.User.FindFirst(ClaimTypes.Role);
                var cooperativaClaim = context.User.FindFirst("idCooperativa");

                if (userIdClaim != null)
                {
                    context.Items["UserId"] = userIdClaim.Value;
                }

                if (roleClaim != null)
                {
                    context.Items["UserRole"] = roleClaim.Value;
                }

                if (cooperativaClaim != null)
                {
                    context.Items["IdCooperativa"] = cooperativaClaim.Value;
                }
            }

            await _next(context);
        }
    }

    /// <summary>
    /// Extensión para registrar el middleware
    /// </summary>
    public static class RoleAuthorizationMiddlewareExtensions
    {
        public static IApplicationBuilder UseRoleAuthorization(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<RoleAuthorizationMiddleware>();
        }
    }
}

