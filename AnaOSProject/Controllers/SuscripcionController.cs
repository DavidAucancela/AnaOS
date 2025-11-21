using AnaOSProject.Attributes;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnaOSProject.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class SuscripcionController : ControllerBase{
    private readonly ISuscripcionService _suscripcionService;
    private readonly IUsuarioService _usuarioService;

    public SuscripcionController(ISuscripcionService suscripcionService, IUsuarioService usuarioService)
    {
        _suscripcionService = suscripcionService;
        _usuarioService = usuarioService;
    }

    private async Task<Usuario?> GetUsuarioActualAsync()
    {
        var correo = User.Identity?.Name;
        if (string.IsNullOrEmpty(correo))
            return null;

        return await _usuarioService.GetByCorreoAsync(correo);
    }

    // GET: api/Suscripcion/ByCooperativa/{idCooperativa}
    [HttpGet("ByCooperativa/{idCooperativa:int}")]
    public async Task<IActionResult> GetByCooperativa(int idCooperativa)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            // Solo administrador o usuarios de la misma cooperativa pueden ver suscripciones
            if (usuarioActual.Rol != "Administrador" && 
                (usuarioActual.IdCooperativa == null || usuarioActual.IdCooperativa != idCooperativa))
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "No tiene permisos para ver estas suscripciones." });
            }

            var suscripciones = await _suscripcionService.GetByCooperativaAsync(idCooperativa);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = suscripciones });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/Suscripcion/Active/ByCooperativa/{idCooperativa}
    [HttpGet("Active/ByCooperativa/{idCooperativa:int}")]
    public async Task<IActionResult> GetActiveByCooperativa(int idCooperativa)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            // Solo administrador o usuarios de la misma cooperativa pueden ver suscripciones
            if (usuarioActual.Rol != "Administrador" &&
                (usuarioActual.IdCooperativa == null || usuarioActual.IdCooperativa != idCooperativa))
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "No tiene permisos para ver esta suscripción." });
            }

            var suscripcion = await _suscripcionService.GetActiveByCooperativaAsync(idCooperativa);
            if (suscripcion == null)
                return StatusCode(StatusCodes.Status404NotFound,
                    new { isSuccess = false, message = "No se encontró una suscripción activa." });

            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = suscripcion });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // POST: api/Suscripcion
    [HttpPost]
    public async Task<IActionResult> Create(SuscripcionCreateDTO dto)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            // Solo administrador o usuarios de la misma cooperativa pueden crear suscripciones
            if (usuarioActual.Rol != "Administrador" &&
                (usuarioActual.IdCooperativa == null || usuarioActual.IdCooperativa != dto.IdCooperativa))
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "No tiene permisos para crear suscripciones." });
            }

            var suscripcion = await _suscripcionService.CreateAsync(dto, usuarioActual.IdUsuario);
            return StatusCode(StatusCodes.Status201Created,
                new { isSuccess = true, message = "Suscripción creada exitosamente.", data = suscripcion });
        }
        catch (ArgumentException ex)
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

    // PUT: api/Suscripcion/{id}
    [HttpPut("{id:int}")]
    [RequireRole("Administrador")]
    public async Task<IActionResult> Update(int id, SuscripcionUpdateDTO dto)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            var suscripcion = await _suscripcionService.UpdateAsync(id, dto, usuarioActual.IdUsuario);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, message = "Suscripción actualizada exitosamente.", data = suscripcion });
        }
        catch (ArgumentException ex)
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

    // POST: api/Suscripcion/{id}/Cancel
    [HttpPost("{id:int}/Cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            await _suscripcionService.CancelAsync(id, usuarioActual.IdUsuario);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, message = "Suscripción cancelada exitosamente." });
        }
        catch (ArgumentException ex)
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

    // GET: api/Suscripcion/HasActive/{idCooperativa}
    [HttpGet("HasActive/{idCooperativa:int}")]
    public async Task<IActionResult> HasActive(int idCooperativa)
    {
        try
        {
            var hasActive = await _suscripcionService.HasActiveSubscriptionAsync(idCooperativa);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = new { hasActive } });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // POST: api/Suscripcion/ProcessPayment
    [HttpPost("ProcessPayment")]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentDTO dto)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            // Solo administrador o usuarios de la misma cooperativa pueden procesar pagos
            if (usuarioActual.Rol != "Administrador" &&
                (usuarioActual.IdCooperativa == null || usuarioActual.IdCooperativa != dto.IdCooperativa))
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "No tiene permisos para procesar este pago." });
            }

            // Simular procesamiento de pago Kushki (en producción, aquí se validaría el token con Kushki)
            if (dto.MetodoPago == "Kushki" && !string.IsNullOrEmpty(dto.TokenKushki))
            {
                // En producción, aquí se validaría el token con la API de Kushki
                // Por ahora, simulamos que el pago fue exitoso
                if (!dto.TokenKushki.StartsWith("kushki_sim_"))
                {
                    return StatusCode(StatusCodes.Status400BadRequest,
                        new { isSuccess = false, message = "Token de pago inválido." });
                }
            }

            // Crear la suscripción
            var suscripcionCreateDTO = new SuscripcionCreateDTO
            {
                IdCooperativa = dto.IdCooperativa,
                IdPlan = dto.IdPlan,
                Periodo = dto.Periodo,
                MontoPagado = dto.MontoPagado,
                Moneda = dto.Moneda,
                RenovacionAutomatica = dto.RenovacionAutomatica,
                MetodoPago = dto.MetodoPago,
                IdMetodoPago = dto.IdMetodoPago ?? dto.TokenKushki,
                Ultimos4Digitos = dto.Ultimos4Digitos,
                ComprobantePago = dto.ComprobantePago,
                NombreComprobante = dto.NombreComprobante,
                Notas = dto.Notas
            };

            var suscripcion = await _suscripcionService.CreateAsync(suscripcionCreateDTO, usuarioActual.IdUsuario);

            // Si el pago es con Kushki (simulado), activar inmediatamente
            // Si es con comprobante, queda en estado "pending" para que el admin lo apruebe
            if (dto.MetodoPago == "Kushki")
            {
                var updateDTO = new SuscripcionUpdateDTO
                {
                    Estado = "active"
                };
                suscripcion = await _suscripcionService.UpdateAsync(suscripcion.IdSuscripcion, updateDTO, usuarioActual.IdUsuario);
            }

            return StatusCode(StatusCodes.Status201Created,
                new { isSuccess = true, message = "Pago procesado exitosamente.", data = suscripcion });
        }
        catch (ArgumentException ex)
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

    // GET: api/Suscripcion/ExpiringSoon/{days}
    [HttpGet("ExpiringSoon/{days:int}")]
    [RequireRole("Administrador")]
    public async Task<IActionResult> GetSubscriptionsExpiringSoon(int days = 30)
    {
        try
        {
            var suscripciones = await _suscripcionService.GetSubscriptionsExpiringSoonAsync(days);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = suscripciones });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/Suscripcion/ForRenewal
    [HttpGet("ForRenewal")]
    [RequireRole("Administrador")]
    public async Task<IActionResult> GetSubscriptionsForRenewal()
    {
        try
        {
            var suscripciones = await _suscripcionService.GetSubscriptionsForRenewalAsync();
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = suscripciones });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // POST: api/Suscripcion/{id}/Renew
    [HttpPost("{id:int}/Renew")]
    [RequireRole("Administrador")]
    public async Task<IActionResult> RenewSubscription(int id)
    {
        try
        {
            var usuarioActual = await GetUsuarioActualAsync();
            if (usuarioActual == null)
                return Unauthorized();

            var suscripcion = await _suscripcionService.RenewSubscriptionAsync(id, usuarioActual.IdUsuario);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, message = "Suscripción renovada exitosamente.", data = suscripcion });
        }
        catch (ArgumentException ex)
        {
            return StatusCode(StatusCodes.Status400BadRequest,
                new { isSuccess = false, message = ex.Message });
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
}

public class ProcessPaymentDTO
{
    public int IdCooperativa { get; set; }
    public int IdPlan { get; set; }
    public string Periodo { get; set; } = null!;
    public decimal MontoPagado { get; set; }
    public string Moneda { get; set; } = "USD";
    public bool RenovacionAutomatica { get; set; } = true;
    public string MetodoPago { get; set; } = null!;
    public string? IdMetodoPago { get; set; }
    public string? Ultimos4Digitos { get; set; }
    public string? TokenKushki { get; set; }
    public string? ComprobantePago { get; set; }
    public string? NombreComprobante { get; set; }
    public string? Notas { get; set; }
}

