using AnaOSProject.Attributes;
using AnaOSProject.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Controllers;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class AnalyticsController : ControllerBase
{
    private readonly AnaOSDbContext _context;

    public AnalyticsController(AnaOSDbContext context)
    {
        _context = context;
    }

    // GET: api/Analytics/cooperativa
    // Métricas de la cooperativa del usuario autenticado.
    [HttpGet("cooperativa")]
    [RequireRole("Cooperativa", "UsuarioCooperativa")]
    public async Task<IActionResult> GetCooperativaStats()
    {
        var idCooperativaStr = HttpContext.Items["IdCooperativa"]?.ToString();
        if (!int.TryParse(idCooperativaStr, out var idCooperativa))
            return Unauthorized(new { isSuccess = false, message = "No se pudo identificar la cooperativa." });

        var agencias = await _context.Agencias.CountAsync(a => a.IdCooperativa == idCooperativa);

        var cuentas = await _context.Cuentas
            .Where(c => c.IdCooperativa == idCooperativa)
            .Select(c => c.Estado)
            .ToListAsync();

        var usuarios = await _context.Usuarios.CountAsync(u => u.IdCooperativa == idCooperativa);

        var socios = await _context.Socios
            .Where(s => s.IdCooperativa == idCooperativa)
            .GroupBy(s => s.Estado)
            .Select(g => new { estado = g.Key, cantidad = g.Count() })
            .ToListAsync();

        var suscripcion = await _context.Suscripciones
            .Include(s => s.IdPlanNavigation)
            .Where(s => s.IdCooperativa == idCooperativa && s.Estado == "active")
            .OrderByDescending(s => s.FechaCreacion)
            .FirstOrDefaultAsync();

        object? suscripcionData = null;
        if (suscripcion != null)
        {
            var diasRestantes = Math.Max(0, (int)(suscripcion.FechaFin - DateTime.Now).TotalDays);
            suscripcionData = new
            {
                plan = suscripcion.IdPlanNavigation?.Nombre,
                estado = suscripcion.Estado,
                periodo = suscripcion.Periodo,
                fechaFin = suscripcion.FechaFin,
                diasRestantes
            };
        }

        return Ok(new
        {
            isSuccess = true,
            data = new
            {
                agencias,
                cuentas = new
                {
                    total = cuentas.Count,
                    activas = cuentas.Count(e => e != null && e.Equals("activa", StringComparison.OrdinalIgnoreCase)),
                    cerradas = cuentas.Count(e => e != null && !e.Equals("activa", StringComparison.OrdinalIgnoreCase))
                },
                usuarios,
                socios = new
                {
                    total = socios.Sum(s => s.cantidad),
                    activos = socios.FirstOrDefault(s => s.estado == "Activo")?.cantidad ?? 0,
                    inactivos = socios.FirstOrDefault(s => s.estado == "Inactivo")?.cantidad ?? 0
                },
                suscripcion = suscripcionData
            }
        });
    }

    // GET: api/Analytics/admin
    // Métricas globales de la plataforma para el Administrador.
    [HttpGet("admin")]
    [RequireRole("Administrador")]
    public async Task<IActionResult> GetAdminStats()
    {
        var totalCooperativas = await _context.Cooperativas.CountAsync();

        var totalUsuarios = await _context.Usuarios
            .CountAsync(u => u.Rol != "Administrador" && u.Rol != "Gerente");

        var suscripcionesActivas = await _context.Suscripciones
            .Include(s => s.IdPlanNavigation)
            .Where(s => s.Estado == "active")
            .ToListAsync();

        var ingresosEstimadosMensual = suscripcionesActivas.Sum(s =>
            s.Periodo == "annual"
                ? (s.IdPlanNavigation?.PrecioAnual ?? 0) / 12
                : s.IdPlanNavigation?.PrecioMensual ?? 0);

        var distribucionPlanes = suscripcionesActivas
            .GroupBy(s => s.IdPlanNavigation?.Nombre ?? "Sin plan")
            .Select(g => new { plan = g.Key, cantidad = g.Count() })
            .OrderByDescending(x => x.cantidad)
            .ToList();

        // Nuevas cooperativas por mes — últimos 6 meses
        var desde = DateTime.Now.AddMonths(-5);
        var nuevasPorMes = await _context.Cooperativas
            .Where(c => c.FechaCreacion != null && c.FechaCreacion >= desde)
            .GroupBy(c => new { c.FechaCreacion!.Value.Year, c.FechaCreacion!.Value.Month })
            .Select(g => new { anio = g.Key.Year, mes = g.Key.Month, cantidad = g.Count() })
            .OrderBy(g => g.anio).ThenBy(g => g.mes)
            .ToListAsync();

        // Rellenar meses sin registros con 0
        var mesesCompletos = Enumerable.Range(0, 6).Select(i =>
        {
            var fecha = DateTime.Now.AddMonths(-5 + i);
            var encontrado = nuevasPorMes.FirstOrDefault(m => m.anio == fecha.Year && m.mes == fecha.Month);
            return new
            {
                label = fecha.ToString("MMM yy"),
                cantidad = encontrado?.cantidad ?? 0
            };
        }).ToList();

        return Ok(new
        {
            isSuccess = true,
            data = new
            {
                totalCooperativas,
                totalUsuarios,
                suscripcionesActivas = suscripcionesActivas.Count,
                ingresosEstimadosMensual = Math.Round(ingresosEstimadosMensual, 2),
                distribucionPlanes,
                nuevasPorMes = mesesCompletos
            }
        });
    }
}
