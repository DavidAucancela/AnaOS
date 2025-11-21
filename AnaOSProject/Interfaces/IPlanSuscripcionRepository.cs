using AnaOSProject.Models;

namespace AnaOSProject.Interfaces;

public interface IPlanSuscripcionRepository : IBaseRepository<PlanSuscripcion>
{
    Task<IEnumerable<PlanSuscripcion>> GetActivePlansAsync();
    Task<IEnumerable<PlanSuscripcion>> GetPlansByTypeAsync(string tipoPlan);
    Task<IEnumerable<PlanSuscripcion>> GetFeaturedPlansAsync();
}

