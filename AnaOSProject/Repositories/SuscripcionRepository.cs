using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories;

public class SuscripcionRepository : BaseRepository<Suscripcion>, ISuscripcionRepository
{
    public SuscripcionRepository(AnaOSDbContext context) : base(context)
    {
    }

    public async Task<Suscripcion?> GetActiveByCooperativaAsync(int idCooperativa)
    {
        return await _dbSet
            .Include(s => s.IdPlanNavigation)
            .Include(s => s.IdCooperativaNavigation)
            .FirstOrDefaultAsync(s => s.IdCooperativa == idCooperativa && 
                                      s.Estado == "active" && 
                                      s.FechaFin >= DateTime.UtcNow);
    }

    public async Task<IEnumerable<Suscripcion>> GetByCooperativaAsync(int idCooperativa)
    {
        return await _dbSet
            .Include(s => s.IdPlanNavigation)
            .Include(s => s.IdCooperativaNavigation)
            .Where(s => s.IdCooperativa == idCooperativa)
            .OrderByDescending(s => s.FechaCreacion)
            .ToListAsync();
    }

    public async Task<bool> HasActiveSubscriptionAsync(int idCooperativa)
    {
        return await _dbSet.AnyAsync(s => s.IdCooperativa == idCooperativa && 
                                         s.Estado == "active" && 
                                         s.FechaFin >= DateTime.UtcNow);
    }

    public async Task<IEnumerable<Suscripcion>> GetSubscriptionsExpiringSoonAsync(int days = 30)
    {
        var fechaLimite = DateTime.UtcNow.AddDays(days);
        return await _dbSet
            .Include(s => s.IdPlanNavigation)
            .Include(s => s.IdCooperativaNavigation)
            .Where(s => s.Estado == "active" && 
                       s.FechaFin >= DateTime.UtcNow && 
                       s.FechaFin <= fechaLimite)
            .OrderBy(s => s.FechaFin)
            .ToListAsync();
    }

    public async Task<IEnumerable<Suscripcion>> GetSubscriptionsForRenewalAsync()
    {
        return await _dbSet
            .Include(s => s.IdPlanNavigation)
            .Include(s => s.IdCooperativaNavigation)
            .Where(s => s.Estado == "active" && 
                       s.RenovacionAutomatica && 
                       s.ProximaFechaCobro <= DateTime.UtcNow)
            .ToListAsync();
    }
}

