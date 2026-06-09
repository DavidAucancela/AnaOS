using AnaOSProject.Attributes;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AnaOSProject.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class SocioController : ControllerBase
{
    private readonly ISocioService _socioService;

    public SocioController(ISocioService socioService)
    {
        _socioService = socioService;
    }

    private int? GetIdCooperativaFromToken()
    {
        var value = HttpContext.Items["IdCooperativa"]?.ToString();
        return int.TryParse(value, out var id) ? id : null;
    }

    private bool IsAdmin() =>
        HttpContext.Items["UserRole"]?.ToString() == "Administrador";

    // GET: api/Socio/ByCooperativa/{idCooperativa}
    [HttpGet("ByCooperativa/{idCooperativa:int}")]
    [RequireRole("Cooperativa", "UsuarioCooperativa", "Administrador", "Gerente")]
    public async Task<IActionResult> GetByCooperativa(int idCooperativa)
    {
        try
        {
            // Cooperativa users can only see their own socios
            var tokenCoopId = GetIdCooperativaFromToken();
            if (!IsAdmin() && tokenCoopId != idCooperativa)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "Sin permisos para ver estos socios." });

            var socios = await _socioService.GetByCooperativaIdAsync(idCooperativa);
            return Ok(new { isSuccess = true, data = socios.Select(MapToDTO) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/Socio/{id}
    [HttpGet("{id:int}")]
    [RequireRole("Cooperativa", "UsuarioCooperativa", "Administrador", "Gerente")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var socio = await _socioService.GetByIdAsync(id);
            if (socio == null)
                return NotFound(new { isSuccess = false, message = "Socio no encontrado." });

            var tokenCoopId = GetIdCooperativaFromToken();
            if (!IsAdmin() && tokenCoopId != socio.IdCooperativa)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "Sin permisos." });

            return Ok(new { isSuccess = true, data = MapToDTO(socio) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // POST: api/Socio
    [HttpPost]
    [RequireRole("Cooperativa", "Administrador")]
    public async Task<IActionResult> Create([FromBody] SocioCreateDTO dto)
    {
        try
        {
            var tokenCoopId = GetIdCooperativaFromToken();
            if (!IsAdmin() && tokenCoopId != dto.IdCooperativa)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "Sin permisos para crear socios en esta cooperativa." });

            // Cédula única por cooperativa
            var existente = await _socioService.GetByCedulaAndCooperativaAsync(dto.Cedula, dto.IdCooperativa);
            if (existente != null)
                return BadRequest(new { isSuccess = false, message = "Ya existe un socio con esa cédula en esta cooperativa." });

            var socio = new Socio
            {
                IdCooperativa = dto.IdCooperativa,
                Cedula = dto.Cedula.Trim(),
                Nombres = dto.Nombres.Trim(),
                Apellidos = dto.Apellidos.Trim(),
                Telefono = dto.Telefono?.Trim(),
                Correo = dto.Correo?.Trim().ToLower(),
                Direccion = dto.Direccion?.Trim(),
                Estado = "Activo",
                FechaIngreso = dto.FechaIngreso ?? DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
                FechaCreacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
                FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified),
            };

            var created = await _socioService.CreateAsync(socio);
            return StatusCode(StatusCodes.Status201Created,
                new { isSuccess = true, message = "Socio registrado exitosamente.", data = MapToDTO(created) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // PUT: api/Socio/{id}
    [HttpPut("{id:int}")]
    [RequireRole("Cooperativa", "Administrador")]
    public async Task<IActionResult> Update(int id, [FromBody] SocioUpdateDTO dto)
    {
        try
        {
            var socio = await _socioService.GetByIdAsync(id);
            if (socio == null)
                return NotFound(new { isSuccess = false, message = "Socio no encontrado." });

            var tokenCoopId = GetIdCooperativaFromToken();
            if (!IsAdmin() && tokenCoopId != socio.IdCooperativa)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "Sin permisos." });

            if (dto.Nombres != null) socio.Nombres = dto.Nombres.Trim();
            if (dto.Apellidos != null) socio.Apellidos = dto.Apellidos.Trim();
            if (dto.Telefono != null) socio.Telefono = dto.Telefono.Trim();
            if (dto.Correo != null) socio.Correo = dto.Correo.Trim().ToLower();
            if (dto.Direccion != null) socio.Direccion = dto.Direccion.Trim();
            if (dto.Estado != null) socio.Estado = dto.Estado;
            if (dto.FechaIngreso.HasValue) socio.FechaIngreso = dto.FechaIngreso;
            socio.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

            await _socioService.UpdateAsync(socio);
            return Ok(new { isSuccess = true, message = "Socio actualizado.", data = MapToDTO(socio) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // DELETE: api/Socio/{id}  (soft delete — cambia estado a Inactivo)
    [HttpDelete("{id:int}")]
    [RequireRole("Cooperativa", "Administrador")]
    public async Task<IActionResult> Deactivate(int id)
    {
        try
        {
            var socio = await _socioService.GetByIdAsync(id);
            if (socio == null)
                return NotFound(new { isSuccess = false, message = "Socio no encontrado." });

            var tokenCoopId = GetIdCooperativaFromToken();
            if (!IsAdmin() && tokenCoopId != socio.IdCooperativa)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { isSuccess = false, message = "Sin permisos." });

            socio.Estado = "Inactivo";
            socio.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
            await _socioService.UpdateAsync(socio);

            return Ok(new { isSuccess = true, message = "Socio desactivado." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    private static SocioDTO MapToDTO(Socio s) => new()
    {
        IdSocio = s.IdSocio,
        IdCooperativa = s.IdCooperativa,
        Cedula = s.Cedula,
        Nombres = s.Nombres,
        Apellidos = s.Apellidos,
        Telefono = s.Telefono,
        Correo = s.Correo,
        Direccion = s.Direccion,
        Estado = s.Estado,
        FechaIngreso = s.FechaIngreso,
        FechaCreacion = s.FechaCreacion,
    };
}
