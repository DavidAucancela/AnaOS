using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories;

public class HistorialSuscripcionRepository : BaseRepository<HistorialSuscripcion>, IHistorialSuscripcionRepository
{
    public HistorialSuscripcionRepository(AnaOSDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<HistorialSuscripcion>> GetBySuscripcionAsync(int idSuscripcion)
    {
        return await _dbSet
            .Include(h => h.IdUsuarioNavigation)
            .Where(h => h.IdSuscripcion == idSuscripcion)
            .OrderByDescending(h => h.FechaCambio)
            .ToListAsync();
    }
}


