using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories
{
    public class AgenciaRepository : BaseRepository<Agencia>, IAgenciaRepository
    {
        public AgenciaRepository(AnaOSDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Agencia>> GetByCooperativaIdAsync(int idCooperativa)
        {
            return await _dbSet
                .Where(a => a.IdCooperativa == idCooperativa)
                .ToListAsync();
        }

        public async Task<Agencia?> GetByCodigoInternoAsync(string codigoInterno)
        {
            return await _dbSet.FirstOrDefaultAsync(a => a.CodigoInterno == codigoInterno);
        }
    }
}

