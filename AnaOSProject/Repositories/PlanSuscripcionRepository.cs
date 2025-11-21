using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories;

public class PlanSuscripcionRepository : BaseRepository<PlanSuscripcion>, IPlanSuscripcionRepository
{
    public PlanSuscripcionRepository(AnaOSDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<PlanSuscripcion>> GetActivePlansAsync()
    {
        return await _dbSet
            .Where(p => p.Activo)
            .OrderBy(p => p.PrecioMensual)
            .ToListAsync();
    }

    public async Task<IEnumerable<PlanSuscripcion>> GetPlansByTypeAsync(string tipoPlan)
    {
        return await _dbSet
            .Where(p => p.Activo && p.TipoPlan.ToLower() == tipoPlan.ToLower())
            .OrderBy(p => p.PrecioMensual)
            .ToListAsync();
    }

    public async Task<IEnumerable<PlanSuscripcion>> GetFeaturedPlansAsync()
    {
        return await _dbSet
            .Where(p => p.Activo && p.Destacado)
            .OrderBy(p => p.PrecioMensual)
            .ToListAsync();
    }
}

