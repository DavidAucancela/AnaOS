using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace AnaOSProject.Attributes
{
    /// <summary>
    /// Atributo personalizado para requerir roles específicos en endpoints
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class RequireRoleAttribute : Attribute, IAuthorizationFilter
    {
        private readonly string[] _allowedRoles;

        public RequireRoleAttribute(params string[] roles)
        {
            _allowedRoles = roles;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            // Si el usuario no está autenticado, el middleware de autenticación ya lo maneja
            if (!context.HttpContext.User.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedObjectResult(
                    new { isSuccess = false, message = "No autenticado." });
                return;
            }

            // Obtener el rol del usuario desde los claims
            var userRole = context.HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            if (string.IsNullOrEmpty(userRole))
            {
                context.Result = new StatusCodeResult(403);
                context.Result = new ObjectResult(
                    new { isSuccess = false, message = "No se encontró el rol del usuario." })
                {
                    StatusCode = 403
                };
                return;
            }

            // Verificar si el rol del usuario está en la lista de roles permitidos
            if (!_allowedRoles.Contains(userRole, StringComparer.OrdinalIgnoreCase))
            {
                context.Result = new ObjectResult(
                    new { isSuccess = false, message = $"No tiene permisos. Se requiere uno de los siguientes roles: {string.Join(", ", _allowedRoles)}" })
                {
                    StatusCode = 403
                };
                return;
            }
        }
    }
}

