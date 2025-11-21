using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories
{
    public class CooperativaRepository : BaseRepository<Cooperativa>, ICooperativaRepository
    {
        public CooperativaRepository(AnaOSDbContext context) : base(context)
        {
        }

        public async Task<Cooperativa?> GetByRucAsync(string ruc)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Ruc == ruc);
        }

        public async Task<bool> ExistsByRucAsync(string ruc)
        {
            return await _dbSet.AnyAsync(c => c.Ruc == ruc);
        }
    }
}

