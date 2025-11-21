using AnaOSProject.Custom;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AnaOSProject.Controllers
{
    // localhost:5000/api/Acceso
    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly IUsuarioService _usuarioService;
        private readonly ICooperativaService _cooperativaService;
        private readonly IAgenciaService _agenciaService;
        private readonly Utilidades _utilidades;

        public AccesoController(IUsuarioService usuarioService, ICooperativaService cooperativaService, IAgenciaService agenciaService, Utilidades utilidades)
        {
            _usuarioService = usuarioService;
            _cooperativaService = cooperativaService;
            _agenciaService = agenciaService;
            _utilidades = utilidades;
        }

        // POST: api/Acceso/Registrarse
        [HttpPost("Registrarse")]
        public async Task<IActionResult> Registrarse(UsuarioCreateDTO objeto)
        {
            try
            {
                // Verificar si el correo ya existe
                if (await _usuarioService.ExistsByCorreoAsync(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, 
                        new { isSuccess = false, message = "El correo electrónico ya está registrado." });
                }

                // Validar que solo se puede crear una cooperativa (no gerentes ni admins)
                // Los gerentes solo pueden ser creados por el administrador
                var rol = objeto.Rol ?? "UsuarioCooperativa";
                if (rol == "Administrador" || rol == "Gerente")
                {
                    return StatusCode(StatusCodes.Status403Forbidden, 
                        new { isSuccess = false, message = "Los roles 'Administrador' y 'Gerente' solo pueden ser asignados por un administrador del sistema." });
                }

                var usuarioRegistrado = await _usuarioService.RegisterAsync(new UsuarioDTO
                {
                    Nombres = objeto.Nombres,
                    Apellidos = objeto.Apellidos,
                    Correo = objeto.Correo,
                    Contrasena = objeto.Contrasena,
                    Rol = rol,
                    IdCooperativa = objeto.IdCooperativa,
                    Cargo = objeto.Cargo,
                    Funcion = objeto.Funcion,
                    Celular = objeto.Celular,
                    ArchivoNombramiento = objeto.ArchivoNombramiento,
                    NombreArchivo = objeto.NombreArchivo
                });

                if (usuarioRegistrado.IdUsuario != 0)
                    return StatusCode(StatusCodes.Status201Created, 
                        new { isSuccess = true, message = "Usuario registrado exitosamente.", idUsuario = usuarioRegistrado.IdUsuario });
                else
                    return StatusCode(StatusCodes.Status500InternalServerError, 
                        new { isSuccess = false, message = "Error al registrar el usuario." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Acceso/RegistroCompleto
        [HttpPost("RegistroCompleto")]
        public async Task<IActionResult> RegistroCompleto(RegistroCompletoDTO objeto)
        {
            try
            {
                // Validaciones
                if (string.IsNullOrWhiteSpace(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "El correo electrónico es requerido." });
                }

                if (string.IsNullOrWhiteSpace(objeto.Contrasena))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "La contraseña es requerida." });
                }

                // Verificar si el correo ya existe
                if (await _usuarioService.ExistsByCorreoAsync(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "El correo electrónico ya está registrado." });
                }

                // Verificar si el RUC ya existe
                if (await _cooperativaService.ExistsByRucAsync(objeto.Ruc))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "El RUC ya está registrado." });
                }

                // Convertir base64 a byte[] si existen los archivos
                byte[]? archivoNombramientoBytes = null;
                byte[]? logoBytes = null;

                if (!string.IsNullOrEmpty(objeto.ArchivoNombramiento))
                {
                    try
                    {
                        archivoNombramientoBytes = Convert.FromBase64String(objeto.ArchivoNombramiento);
                    }
                    catch (FormatException)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = "El formato del archivo de nombramiento no es válido." });
                    }
                }

                if (!string.IsNullOrEmpty(objeto.Logo))
                {
                    try
                    {
                        logoBytes = Convert.FromBase64String(objeto.Logo);
                    }
                    catch (FormatException)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = "El formato del logo no es válido." });
                    }
                }

                // Crear la cooperativa primero
                var cooperativa = new Cooperativa
                {
                    Nombre = objeto.NombreCooperativa,
                    Ruc = objeto.Ruc,
                    Direccion = objeto.Direccion,
                    Telefono = objeto.Celular, // Usar celular del usuario como teléfono de la cooperativa
                    Correo = objeto.Correo, // Usar correo del usuario como correo de la cooperativa
                    ArchivoNombramiento = archivoNombramientoBytes, // Convertido de base64 a byte[]
                    NombreArchivo = objeto.NombreArchivo,
                    Logo = logoBytes, // Convertido de base64 a byte[]
                    NombreLogo = objeto.NombreLogo
                };

                var cooperativaCreada = await _cooperativaService.CreateAsync(cooperativa);

                // Crear la agencia matriz por defecto con los datos de la cooperativa
                Agencia? agenciaMatriz = null;
                try
                {
                    agenciaMatriz = new Agencia
                    {
                        IdCooperativa = cooperativaCreada.IdCooperativa,
                        Nombre = "Matriz",
                        CodigoInterno = "MATRIZ",
                        Direccion = cooperativa.Direccion,
                        Telefono = cooperativa.Telefono,
                        NombreResponsable = $"{objeto.Nombres} {objeto.Apellidos}",
                        // Los campos de ubicación pueden ser null si no se proporcionan
                        Provincia = null,
                        Canton = null,
                        Ciudad = null,
                        HoraApertura = null,
                        HoraCierre = null,
                        FechaCreacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified)
                    };

                    agenciaMatriz = await _agenciaService.CreateAsync(agenciaMatriz);
                }
                catch (Exception ex)
                {
                    // Si falla la creación de la agencia, intentar eliminar la cooperativa creada
                    try
                    {
                        await _cooperativaService.DeleteAsync(cooperativaCreada.IdCooperativa);
                    }
                    catch { }

                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new { isSuccess = false, message = $"Error al crear la agencia matriz: {ex.Message}" });
                }

                // Crear el usuario asociado a la cooperativa
                // El rol debe ser siempre "Cooperativa" en el signup
                var rol = "Cooperativa";
                
                // Validar que no se intente crear admin o gerente desde signup
                if (objeto.Rol == "Administrador" || objeto.Rol == "Gerente")
                {
                    // Si falla la creación del usuario, intentar eliminar la agencia y cooperativa creadas
                    try
                    {
                        if (agenciaMatriz != null)
                            await _agenciaService.DeleteAsync(agenciaMatriz.IdAgencia);
                        await _cooperativaService.DeleteAsync(cooperativaCreada.IdCooperativa);
                    }
                    catch { }

                    return StatusCode(StatusCodes.Status403Forbidden,
                        new { isSuccess = false, message = "Los roles 'Administrador' y 'Gerente' solo pueden ser asignados por un administrador del sistema." });
                }

                var usuarioRegistrado = await _usuarioService.RegisterAsync(new UsuarioDTO
                {
                    Nombres = objeto.Nombres,
                    Apellidos = objeto.Apellidos,
                    Correo = objeto.Correo,
                    Contrasena = objeto.Contrasena,
                    Rol = rol,
                    IdCooperativa = cooperativaCreada.IdCooperativa, // Asignar la cooperativa creada al usuario
                    Cargo = objeto.Cargo,
                    Funcion = objeto.Funcion,
                    Celular = objeto.Celular,
                    // El archivo de nombramiento se guarda solo en la cooperativa
                    ArchivoNombramiento = null,
                    NombreArchivo = null
                });

                if (usuarioRegistrado.IdUsuario != 0)
                {
                    return StatusCode(StatusCodes.Status201Created,
                        new
                        {
                            isSuccess = true,
                            message = "Cooperativa, agencia matriz y usuario registrados exitosamente.",
                            data = new
                            {
                                idCooperativa = cooperativaCreada.IdCooperativa,
                                idAgencia = agenciaMatriz?.IdAgencia,
                                idUsuario = usuarioRegistrado.IdUsuario
                            }
                        });
                }
                else
                {
                    // Si falla la creación del usuario, intentar eliminar la agencia y cooperativa creadas
                    try
                    {
                        if (agenciaMatriz != null)
                            await _agenciaService.DeleteAsync(agenciaMatriz.IdAgencia);
                        await _cooperativaService.DeleteAsync(cooperativaCreada.IdCooperativa);
                    }
                    catch { }

                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new { isSuccess = false, message = "Error al registrar el usuario." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Acceso/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDTO objeto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(objeto.Correo) || string.IsNullOrWhiteSpace(objeto.Contrasena))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, 
                        new { isSuccess = false, message = "El correo y la contraseña son requeridos." });
                }

                var correoNormalizado = objeto.Correo.Trim().ToLower();
                var passwordHash = Utilidades.EncriptarSHA256(objeto.Contrasena);
                
                // Primero buscar el usuario por correo
                var usuarioPorCorreo = await _usuarioService.GetByCorreoAsync(correoNormalizado);
                
                if (usuarioPorCorreo == null)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, 
                        new { isSuccess = false, message = "Credenciales inválidas. Usuario no encontrado." });
                }

                // TEMPORAL: Debug información
                var hashEnBD = usuarioPorCorreo.ContrasenaHash;
                var hashCoincide = hashEnBD == passwordHash;
                
                // Verificar la contraseña
                var usuarioEncontrado = await _usuarioService.LoginAsync(correoNormalizado, passwordHash);

                if (usuarioEncontrado == null)
                {
                    // El usuario existe pero la contraseña es incorrecta
                    // TEMPORAL: Devolver información de debug
                    return StatusCode(StatusCodes.Status401Unauthorized, 
                        new { 
                            isSuccess = false, 
                            message = "Credenciales inválidas. Contraseña incorrecta.",
                            debug = new {
                                correoBuscado = correoNormalizado,
                                correoEnBD = usuarioPorCorreo.Correo,
                                hashGenerado = passwordHash,
                                hashEnBD = hashEnBD,
                                hashCoincide = hashCoincide,
                                longitudHashGenerado = passwordHash.Length,
                                longitudHashBD = hashEnBD?.Length ?? 0,
                                contrasenaIngresada = objeto.Contrasena
                            }
                        });
                }

                var token = _utilidades.GenerarJWT(usuarioEncontrado);
                return StatusCode(StatusCodes.Status200OK, 
                    new { 
                        isSuccess = true, 
                        token = token,
                        usuario = new
                        {
                            idUsuario = usuarioEncontrado.IdUsuario,
                            nombres = usuarioEncontrado.Nombres,
                            apellidos = usuarioEncontrado.Apellidos,
                            correo = usuarioEncontrado.Correo,
                            rol = usuarioEncontrado.Rol,
                            idCooperativa = usuarioEncontrado.IdCooperativa,
                            cargo = usuarioEncontrado.Cargo,
                            celular = usuarioEncontrado.Celular
                        }
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}", stackTrace = ex.StackTrace });
            }
        }

        // GET: api/Acceso/GenerateHash/{password} - TEMPORAL: Para generar hash de contraseñas
        [HttpGet("GenerateHash/{password}")]
        public IActionResult GenerateHash(string password)
        {
            var hash = Utilidades.EncriptarSHA256(password);
            return Ok(new { password = password, hash = hash });
        }

        // POST: api/Acceso/ResetPassword
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO objeto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(objeto.Correo))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "El correo electrónico es requerido." });
                }

                var correoNormalizado = objeto.Correo.Trim().ToLower();

                // Verificar si el correo existe
                if (!await _usuarioService.ExistsByCorreoAsync(correoNormalizado))
                {
                    // Por seguridad, no revelamos si el correo existe o no
                    return StatusCode(StatusCodes.Status200OK,
                        new
                        {
                            isSuccess = true,
                            message = "Si el correo está registrado, recibirás un email con tu nueva contraseña."
                        });
                }

                // Resetear la contraseña
                var nuevaContrasena = await _usuarioService.ResetPasswordAsync(correoNormalizado);

                // Obtener el usuario para mostrar su nombre
                var usuario = await _usuarioService.GetByCorreoAsync(correoNormalizado);

                // Simular envío de correo (mostrar en consola)
                Console.WriteLine("========================================");
                Console.WriteLine("CORREO DE RESTABLECIMIENTO DE CONTRASEÑA");
                Console.WriteLine("========================================");
                Console.WriteLine($"Para: {usuario?.Correo}");
                Console.WriteLine($"Asunto: Restablecimiento de Contraseña - Ana-OS");
                Console.WriteLine("");
                Console.WriteLine($"Estimado/a {usuario?.Nombres} {usuario?.Apellidos},");
                Console.WriteLine("");
                Console.WriteLine("Se ha solicitado el restablecimiento de tu contraseña.");
                Console.WriteLine("");
                Console.WriteLine($"Tu nueva contraseña es: {nuevaContrasena}");
                Console.WriteLine("");
                Console.WriteLine("Por favor, inicia sesión con esta contraseña y cámbiala por una de tu elección.");
                Console.WriteLine("");
                Console.WriteLine("Si no solicitaste este cambio, por favor contacta al soporte técnico.");
                Console.WriteLine("");
                Console.WriteLine("Saludos,");
                Console.WriteLine("Equipo Ana-OS");
                Console.WriteLine("========================================");

                return StatusCode(StatusCodes.Status200OK,
                    new
                    {
                        isSuccess = true,
                        message = "Si el correo está registrado, recibirás un email con tu nueva contraseña."
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Acceso/DebugLogin/{correo} - TEMPORAL: Para depurar problemas de login
        [HttpGet("DebugLogin/{correo}")]
        public async Task<IActionResult> DebugLogin(string correo)
        {
            try
            {
                var correoNormalizado = correo.Trim().ToLower();
                var usuario = await _usuarioService.GetByCorreoAsync(correoNormalizado);
                
                if (usuario == null)
                {
                    return Ok(new { 
                        encontrado = false, 
                        mensaje = "Usuario no encontrado",
                        correoBuscado = correoNormalizado
                    });
                }

                var hashAdmin123 = Utilidades.EncriptarSHA256("admin123");
                var hashEnBD = usuario.ContrasenaHash ?? "";
                
                // Comparación caracter por caracter para encontrar diferencias
                var diferencias = new List<object>();
                var minLength = Math.Min(hashAdmin123.Length, hashEnBD.Length);
                for (int i = 0; i < minLength; i++)
                {
                    if (hashAdmin123[i] != hashEnBD[i])
                    {
                        diferencias.Add(new { posicion = i, esperado = hashAdmin123[i], encontrado = hashEnBD[i] });
                    }
                }
                
                return Ok(new { 
                    encontrado = true,
                    correoBuscado = correoNormalizado,
                    correoEnBD = usuario.Correo,
                    hashEnBD = hashEnBD,
                    hashGeneradoParaAdmin123 = hashAdmin123,
                    hashCoincide = usuario.ContrasenaHash == hashAdmin123,
                    longitudHashBD = hashEnBD.Length,
                    longitudHashGenerado = hashAdmin123.Length,
                    diferencias = diferencias,
                    hashEnBDBytes = System.Text.Encoding.UTF8.GetBytes(hashEnBD).Select(b => b.ToString("x2")).ToArray(),
                    hashGeneradoBytes = System.Text.Encoding.UTF8.GetBytes(hashAdmin123).Select(b => b.ToString("x2")).ToArray(),
                    rol = usuario.Rol
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { error = ex.Message, stackTrace = ex.StackTrace });
            }
        }
    }
}