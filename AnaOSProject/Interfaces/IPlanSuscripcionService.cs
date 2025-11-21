using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Interfaces;

public interface IPlanSuscripcionService : IBaseService<PlanSuscripcion>
{
    Task<PlanSuscripcionDTO?> GetByIdDTOAsync(int id);
    Task<IEnumerable<PlanSuscripcionDTO>> GetActivePlansAsync();
    Task<IEnumerable<PlanSuscripcionDTO>> GetPlansByTypeAsync(string tipoPlan);
    Task<IEnumerable<PlanSuscripcionDTO>> GetFeaturedPlansAsync();
    Task<PlanSuscripcionDTO> CreateAsync(PlanSuscripcionCreateDTO dto);
    Task<PlanSuscripcionDTO> UpdateAsync(int id, PlanSuscripcionUpdateDTO dto);
}

