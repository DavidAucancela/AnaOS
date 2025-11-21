using AnaOSProject.Attributes;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnaOSProject.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;

        public UsuarioController(IUsuarioService usuarioService)
        {
            _usuarioService = usuarioService;
        }

        // GET: api/Usuario
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                IEnumerable<Usuario> usuarios;

                // Administrador y Gerente pueden ver todos los usuarios
                if (usuarioActual.Rol == "Administrador" || usuarioActual.Rol == "Gerente")
                {
                    usuarios = await _usuarioService.GetAllAsync();
                }
                // Usuario de cooperativa solo ve usuarios de su cooperativa
                else if (usuarioActual.IdCooperativa.HasValue)
                {
                    usuarios = await _usuarioService.FindAsync(u => u.IdCooperativa == usuarioActual.IdCooperativa.Value);
                }
                else
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                        new { isSuccess = false, message = "No tiene permisos para ver usuarios." });
                }

                var usuariosDTO = usuarios.Select(u => new UsuarioDTO
                {
                    IdUsuario = u.IdUsuario,
                    IdCooperativa = u.IdCooperativa,
                    Nombres = u.Nombres,
                    Apellidos = u.Apellidos,
                    Correo = u.Correo,
                    Rol = u.Rol,
                    Cargo = u.Cargo,
                    Celular = u.Celular
                });

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = usuariosDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Usuario/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var usuario = await _usuarioService.GetByIdAsync(id);
                if (usuario == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Usuario no encontrado." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue ||
                        usuarioActual.IdCooperativa.Value != usuario.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver este usuario." });
                    }
                }

                var usuarioDTO = new UsuarioDTO
                {
                    IdUsuario = usuario.IdUsuario,
                    IdCooperativa = usuario.IdCooperativa,
                    Nombres = usuario.Nombres,
                    Apellidos = usuario.Apellidos,
                    Correo = usuario.Correo,
                    Rol = usuario.Rol,
                    Cargo = usuario.Cargo,
                    Celular = usuario.Celular
                };

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = usuarioDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Usuario/ByCorreo/{correo}
        [HttpGet("ByCorreo/{correo}")]
        public async Task<IActionResult> GetByCorreo(string correo)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var usuario = await _usuarioService.GetByCorreoAsync(correo);
                if (usuario == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Usuario no encontrado." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue ||
                        usuarioActual.IdCooperativa.Value != usuario.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver este usuario." });
                    }
                }

                var usuarioDTO = new UsuarioDTO
                {
                    IdUsuario = usuario.IdUsuario,
                    IdCooperativa = usuario.IdCooperativa,
                    Nombres = usuario.Nombres,
                    Apellidos = usuario.Apellidos,
                    Correo = usuario.Correo,
                    Rol = usuario.Rol,
                    Cargo = usuario.Cargo,
                    Celular = usuario.Celular
                };

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = usuarioDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Usuario/CrearGerente
        [HttpPost("CrearGerente")]
        [RequireRole("Administrador")]
        public async Task<IActionResult> CrearGerente(UsuarioCreateDTO objeto)
        {
            try
            {
                // Verificar si el correo ya existe
                if (await _usuarioService.ExistsByCorreoAsync(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "El correo electrónico ya está registrado." });
                }

                // Forzar que sea Gerente y sin cooperativa
                objeto.Rol = "Gerente";
                objeto.IdCooperativa = null;

                var usuarioDTO = new UsuarioDTO
                {
                    Nombres = objeto.Nombres,
                    Apellidos = objeto.Apellidos,
                    Correo = objeto.Correo,
                    Contrasena = objeto.Contrasena,
                    Rol = objeto.Rol,
                    IdCooperativa = objeto.IdCooperativa,
                    Cargo = objeto.Cargo,
                    Funcion = objeto.Funcion,
                    Celular = objeto.Celular,
                    ArchivoNombramiento = objeto.ArchivoNombramiento,
                    NombreArchivo = objeto.NombreArchivo
                };

                var usuarioCreado = await _usuarioService.RegisterAsync(usuarioDTO);
                return StatusCode(StatusCodes.Status201Created,
                    new { isSuccess = true, message = "Gerente creado exitosamente.", data = usuarioCreado });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { isSuccess = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Usuario/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UsuarioUpdateDTO objeto)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var usuario = await _usuarioService.GetByIdAsync(id);
                if (usuario == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Usuario no encontrado." });

                // Validar permisos: solo Admin puede modificar Gerentes o cambiar roles
                if (usuario.Rol == "Gerente" || usuario.Rol == "Administrador")
                {
                    if (usuarioActual.Rol != "Administrador")
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "Solo el administrador puede modificar gerentes o administradores." });
                    }
                }

                // Validar lógica de roles al actualizar
                if (!string.IsNullOrEmpty(objeto.Rol))
                {
                    var nuevoRol = objeto.Rol;
                    var nuevoIdCooperativa = objeto.IdCooperativa ?? usuario.IdCooperativa;

                    // Si es Administrador o Gerente, no debe tener id_cooperativa
                    if ((nuevoRol == "Administrador" || nuevoRol == "Gerente") && nuevoIdCooperativa.HasValue)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = $"Los usuarios con rol '{nuevoRol}' no pueden estar asociados a una cooperativa." });
                    }

                    // Si es usuario de cooperativa, debe tener id_cooperativa
                    if (nuevoRol != "Administrador" && nuevoRol != "Gerente" && !nuevoIdCooperativa.HasValue)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = $"Los usuarios con rol '{nuevoRol}' deben estar asociados a una cooperativa." });
                    }

                    usuario.Rol = nuevoRol;
                }

                if (objeto.IdCooperativa.HasValue)
                    usuario.IdCooperativa = objeto.IdCooperativa;
                if (!string.IsNullOrEmpty(objeto.Nombres))
                    usuario.Nombres = objeto.Nombres;
                if (!string.IsNullOrEmpty(objeto.Apellidos))
                    usuario.Apellidos = objeto.Apellidos;
                if (!string.IsNullOrEmpty(objeto.Contrasena))
                    usuario.ContrasenaHash = Custom.Utilidades.EncriptarSHA256(objeto.Contrasena);
                if (objeto.Cargo != null)
                    usuario.Cargo = objeto.Cargo;
                if (objeto.Funcion != null)
                    usuario.Funcion = objeto.Funcion;
                if (objeto.Celular != null)
                    usuario.Celular = objeto.Celular;

                // PostgreSQL timestamp without time zone requiere DateTime sin Kind UTC
                usuario.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

                await _usuarioService.UpdateAsync(usuario);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Usuario actualizado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // DELETE: api/Usuario/{id}
        [HttpDelete("{id:int}")]
        [RequireRole("Administrador")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var usuario = await _usuarioService.GetByIdAsync(id);
                if (usuario == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Usuario no encontrado." });

                await _usuarioService.DeleteAsync(id);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Usuario eliminado exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // Método auxiliar para obtener el usuario actual desde el token JWT
        private async Task<Usuario?> GetUsuarioActualAsync()
        {
            var userIdClaim = User.FindFirst("idUsuario") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            return await _usuarioService.GetByIdAsync(userId);
        }
    }
}
