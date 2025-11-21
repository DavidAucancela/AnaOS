using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using AnaOSProject.Attributes;
using AnaOSProject.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CooperativaController : ControllerBase
    {
        private readonly ICooperativaService _cooperativaService;
        private readonly IAgenciaService _agenciaService;
        private readonly IUsuarioService _usuarioService;
        private readonly ISuscripcionService _suscripcionService;
        private readonly AnaOSDbContext _context;

        public CooperativaController(
            ICooperativaService cooperativaService, 
            IAgenciaService agenciaService, 
            IUsuarioService usuarioService,
            ISuscripcionService suscripcionService,
            Data.AnaOSDbContext context)
        {
            _cooperativaService = cooperativaService;
            _agenciaService = agenciaService;
            _usuarioService = usuarioService;
            _suscripcionService = suscripcionService;
            _context = context;
        }

        // GET: api/Cooperativa
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var cooperativas = await _cooperativaService.GetAllAsync();
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = cooperativas });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cooperativa/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var cooperativa = await _cooperativaService.GetByIdAsync(id);
                if (cooperativa == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Cooperativa no encontrada." });

                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = cooperativa });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cooperativa/ByRuc/{ruc}
        [HttpGet("ByRuc/{ruc}")]
        public async Task<IActionResult> GetByRuc(string ruc)
        {
            try
            {
                var cooperativa = await _cooperativaService.GetByRucAsync(ruc);
                if (cooperativa == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Cooperativa no encontrada." });

                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = cooperativa });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Cooperativa
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Create(CooperativaCreateDTO objeto)
        {
            try
            {
                // Verificar si el RUC ya existe
                if (await _cooperativaService.ExistsByRucAsync(objeto.Ruc))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, 
                        new { isSuccess = false, message = "El RUC ya está registrado." });
                }

                var cooperativa = new Cooperativa
                {
                    Nombre = objeto.Nombre,
                    Ruc = objeto.Ruc,
                    Direccion = objeto.Direccion,
                    Telefono = objeto.Telefono,
                    Correo = objeto.Correo,
                    ArchivoNombramiento = objeto.ArchivoNombramiento,
                    NombreArchivo = objeto.NombreArchivo,
                    Logo = objeto.Logo,
                    NombreLogo = objeto.NombreLogo
                };

                var cooperativaCreada = await _cooperativaService.CreateAsync(cooperativa);
                return StatusCode(StatusCodes.Status201Created, 
                    new { isSuccess = true, message = "Cooperativa creada exitosamente.", data = cooperativaCreada });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Cooperativa/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CooperativaUpdateDTO objeto)
        {
            try
            {
                var cooperativa = await _cooperativaService.GetByIdAsync(id);
                if (cooperativa == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Cooperativa no encontrada." });

                if (!string.IsNullOrEmpty(objeto.Nombre))
                    cooperativa.Nombre = objeto.Nombre;
                if (!string.IsNullOrEmpty(objeto.Direccion))
                    cooperativa.Direccion = objeto.Direccion;
                if (objeto.Telefono != null)
                    cooperativa.Telefono = objeto.Telefono;
                if (objeto.Correo != null)
                    cooperativa.Correo = objeto.Correo;
                // Convertir base64 a byte[] si se proporcionan archivos
                if (!string.IsNullOrEmpty(objeto.ArchivoNombramiento))
                {
                    try
                    {
                        cooperativa.ArchivoNombramiento = Convert.FromBase64String(objeto.ArchivoNombramiento);
                    }
                    catch (FormatException)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = "El formato del archivo de nombramiento no es válido." });
                    }
                }
                if (objeto.NombreArchivo != null)
                    cooperativa.NombreArchivo = objeto.NombreArchivo;
                if (!string.IsNullOrEmpty(objeto.Logo))
                {
                    try
                    {
                        cooperativa.Logo = Convert.FromBase64String(objeto.Logo);
                    }
                    catch (FormatException)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest,
                            new { isSuccess = false, message = "El formato del logo no es válido." });
                    }
                }
                if (objeto.NombreLogo != null)
                    cooperativa.NombreLogo = objeto.NombreLogo;

                // PostgreSQL timestamp without time zone requiere DateTime sin Kind UTC
                cooperativa.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

                await _cooperativaService.UpdateAsync(cooperativa);
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, message = "Cooperativa actualizada exitosamente.", data = cooperativa });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // DELETE: api/Cooperativa/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var cooperativa = await _cooperativaService.GetByIdAsync(id);
                if (cooperativa == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Cooperativa no encontrada." });

                await _cooperativaService.DeleteAsync(id);
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, message = "Cooperativa eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Cooperativa/CrearAgenciasMatriz
        // Endpoint para crear agencias Matriz para todas las cooperativas que no tengan agencias
        [HttpPost("CrearAgenciasMatriz")]
        [RequireRole("Administrador")]
        public async Task<IActionResult> CrearAgenciasMatriz()
        {
            try
            {
                var cooperativas = await _cooperativaService.GetAllAsync();
                var agenciasCreadas = new List<object>();
                var errores = new List<string>();

                foreach (var cooperativa in cooperativas)
                {
                    try
                    {
                        // Verificar si la cooperativa ya tiene agencias
                        var agenciasExistentes = await _agenciaService.GetByCooperativaIdAsync(cooperativa.IdCooperativa);
                        
                        if (agenciasExistentes.Any())
                        {
                            continue; // Ya tiene agencias, saltar
                        }

                        // Obtener el primer usuario de la cooperativa para usar como responsable
                        var todosUsuarios = await _usuarioService.GetAllAsync();
                        var usuariosCooperativa = todosUsuarios.Where(u => u.IdCooperativa == cooperativa.IdCooperativa).ToList();
                        var primerUsuario = usuariosCooperativa.FirstOrDefault();
                        var nombreResponsable = primerUsuario != null 
                            ? $"{primerUsuario.Nombres} {primerUsuario.Apellidos}" 
                            : "Sin asignar";

                        // Crear la agencia Matriz
                        var agenciaMatriz = new Agencia
                        {
                            IdCooperativa = cooperativa.IdCooperativa,
                            Nombre = "Matriz",
                            CodigoInterno = "MATRIZ",
                            Direccion = cooperativa.Direccion,
                            Telefono = cooperativa.Telefono,
                            NombreResponsable = nombreResponsable,
                            Provincia = null,
                            Canton = null,
                            Ciudad = null,
                            HoraApertura = null,
                            HoraCierre = null,
                            FechaCreacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified)
                        };

                        var agenciaCreada = await _agenciaService.CreateAsync(agenciaMatriz);
                        agenciasCreadas.Add(new
                        {
                            idCooperativa = cooperativa.IdCooperativa,
                            nombreCooperativa = cooperativa.Nombre,
                            idAgencia = agenciaCreada.IdAgencia
                        });
                    }
                    catch (Exception ex)
                    {
                        errores.Add($"Error al crear agencia Matriz para cooperativa {cooperativa.Nombre} (ID: {cooperativa.IdCooperativa}): {ex.Message}");
                    }
                }

                return StatusCode(StatusCodes.Status200OK,
                    new
                    {
                        isSuccess = true,
                        message = $"Proceso completado. Se crearon {agenciasCreadas.Count} agencias Matriz.",
                        agenciasCreadas = agenciasCreadas,
                        totalCooperativas = cooperativas.Count(),
                        errores = errores.Any() ? errores : null
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cooperativa/WithSubscriptions
        [HttpGet("WithSubscriptions")]
        [RequireRole("Administrador")]
        public async Task<IActionResult> GetAllWithSubscriptions()
        {
            try
            {
                var cooperativas = await _context.Cooperativas
                    .Include(c => c.Suscripciones)
                        .ThenInclude(s => s.IdPlanNavigation)
                    .ToListAsync();

                var result = cooperativas.Select(c => new
                {
                    idCooperativa = c.IdCooperativa,
                    nombre = c.Nombre,
                    ruc = c.Ruc,
                    direccion = c.Direccion,
                    telefono = c.Telefono,
                    correo = c.Correo,
                    suscripcion = c.Suscripciones
                        .Where(s => s.Estado == "Activa" || s.Estado == "Pendiente")
                        .OrderByDescending(s => s.FechaCreacion)
                        .Select(s => new SuscripcionDTO
                        {
                            IdSuscripcion = s.IdSuscripcion,
                            IdCooperativa = s.IdCooperativa,
                            NombreCooperativa = c.Nombre,
                            IdPlan = s.IdPlan,
                            NombrePlan = s.IdPlanNavigation?.Nombre,
                            Estado = s.Estado,
                            Periodo = s.Periodo,
                            FechaInicio = s.FechaInicio,
                            FechaFin = s.FechaFin,
                            MontoPagado = s.MontoPagado,
                            MetodoPago = s.MetodoPago,
                            NombreComprobante = s.NombreComprobante,
                            FechaCreacion = s.FechaCreacion,
                            FechaActualizacion = s.FechaActualizacion
                        })
                        .FirstOrDefault()
                }).ToList();

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}
