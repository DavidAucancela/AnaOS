using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Services;

public class PlanSuscripcionService : BaseService<PlanSuscripcion>, IPlanSuscripcionService
{
    private readonly IPlanSuscripcionRepository _planRepository;

    public PlanSuscripcionService(IPlanSuscripcionRepository planRepository) 
        : base(planRepository)
    {
        _planRepository = planRepository;
    }

    public async Task<PlanSuscripcionDTO?> GetByIdDTOAsync(int id)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null) return null;
        return MapToDTO(plan);
    }

    public async Task<IEnumerable<PlanSuscripcionDTO>> GetActivePlansAsync()
    {
        var planes = await _planRepository.GetActivePlansAsync();
        return planes.Select(MapToDTO);
    }

    public async Task<IEnumerable<PlanSuscripcionDTO>> GetPlansByTypeAsync(string tipoPlan)
    {
        var planes = await _planRepository.GetPlansByTypeAsync(tipoPlan);
        return planes.Select(MapToDTO);
    }

    public async Task<IEnumerable<PlanSuscripcionDTO>> GetFeaturedPlansAsync()
    {
        var planes = await _planRepository.GetFeaturedPlansAsync();
        return planes.Select(MapToDTO);
    }

    public async Task<PlanSuscripcionDTO> CreateAsync(PlanSuscripcionCreateDTO dto)
    {
        // Validar tipo de plan
        var tipoPlan = dto.TipoPlan.ToLower();
        if (tipoPlan != "basica" && tipoPlan != "professional" && 
            tipoPlan != "enterprise" && tipoPlan != "custom")
        {
            throw new ArgumentException("Tipo de plan inválido. Debe ser: basica, professional, enterprise o custom");
        }

        var plan = new PlanSuscripcion
        {
            Nombre = dto.Nombre,
            TipoPlan = tipoPlan,
            Descripcion = dto.Descripcion,
            PrecioMensual = dto.PrecioMensual,
            PrecioAnual = dto.PrecioAnual,
            Moneda = dto.Moneda ?? "USD",
            MaxUsuarios = dto.MaxUsuarios,
            MaxAgencias = dto.MaxAgencias,
            MaxCuentas = dto.MaxCuentas,
            AlmacenamientoGb = dto.AlmacenamientoGb,
            SoportePrioritario = dto.SoportePrioritario,
            ApiAccess = dto.ApiAccess,
            CustomizacionBranding = dto.CustomizacionBranding,
            Activo = dto.Activo,
            Destacado = dto.Destacado,
            FechaCreacion = DateTime.UtcNow,
            FechaActualizacion = DateTime.UtcNow
        };

        var nuevoPlan = await _planRepository.AddAsync(plan);
        return MapToDTO(nuevoPlan);
    }

    public async Task<PlanSuscripcionDTO> UpdateAsync(int id, PlanSuscripcionUpdateDTO dto)
    {
        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
            throw new ArgumentException("Plan no encontrado");

        if (!string.IsNullOrEmpty(dto.Nombre))
            plan.Nombre = dto.Nombre;
        if (!string.IsNullOrEmpty(dto.TipoPlan))
        {
            var tipoPlan = dto.TipoPlan.ToLower();
            if (tipoPlan != "basica" && tipoPlan != "professional" && 
                tipoPlan != "enterprise" && tipoPlan != "custom")
            {
                throw new ArgumentException("Tipo de plan inválido. Debe ser: basica, professional, enterprise o custom");
            }
            plan.TipoPlan = tipoPlan;
        }
        if (dto.Descripcion != null)
            plan.Descripcion = dto.Descripcion;
        if (dto.PrecioMensual.HasValue)
            plan.PrecioMensual = dto.PrecioMensual.Value;
        if (dto.PrecioAnual.HasValue)
            plan.PrecioAnual = dto.PrecioAnual.Value;
        if (!string.IsNullOrEmpty(dto.Moneda))
            plan.Moneda = dto.Moneda;
        if (dto.MaxUsuarios.HasValue)
            plan.MaxUsuarios = dto.MaxUsuarios;
        if (dto.MaxAgencias.HasValue)
            plan.MaxAgencias = dto.MaxAgencias;
        if (dto.MaxCuentas.HasValue)
            plan.MaxCuentas = dto.MaxCuentas;
        if (dto.AlmacenamientoGb.HasValue)
            plan.AlmacenamientoGb = dto.AlmacenamientoGb;
        if (dto.SoportePrioritario.HasValue)
            plan.SoportePrioritario = dto.SoportePrioritario.Value;
        if (dto.ApiAccess.HasValue)
            plan.ApiAccess = dto.ApiAccess.Value;
        if (dto.CustomizacionBranding.HasValue)
            plan.CustomizacionBranding = dto.CustomizacionBranding.Value;
        if (dto.Activo.HasValue)
            plan.Activo = dto.Activo.Value;
        if (dto.Destacado.HasValue)
            plan.Destacado = dto.Destacado.Value;

        plan.FechaActualizacion = DateTime.UtcNow;

        await _planRepository.UpdateAsync(plan);
        return MapToDTO(plan);
    }

    private PlanSuscripcionDTO MapToDTO(PlanSuscripcion plan)
    {
        return new PlanSuscripcionDTO
        {
            IdPlan = plan.IdPlan,
            Nombre = plan.Nombre,
            TipoPlan = plan.TipoPlan,
            Descripcion = plan.Descripcion,
            PrecioMensual = plan.PrecioMensual,
            PrecioAnual = plan.PrecioAnual,
            Moneda = plan.Moneda,
            MaxUsuarios = plan.MaxUsuarios,
            MaxAgencias = plan.MaxAgencias,
            MaxCuentas = plan.MaxCuentas,
            AlmacenamientoGb = plan.AlmacenamientoGb,
            SoportePrioritario = plan.SoportePrioritario,
            ApiAccess = plan.ApiAccess,
            CustomizacionBranding = plan.CustomizacionBranding,
            Activo = plan.Activo,
            Destacado = plan.Destacado
        };
    }
}

