using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories
{
    public class SocioRepository : BaseRepository<Socio>, ISocioRepository
    {
        public SocioRepository(AnaOSDbContext context) : base(context) { }

        public async Task<IEnumerable<Socio>> GetByCooperativaIdAsync(int idCooperativa)
        {
            return await _dbSet
                .Where(s => s.IdCooperativa == idCooperativa)
                .OrderBy(s => s.Apellidos).ThenBy(s => s.Nombres)
                .ToListAsync();
        }

        public async Task<Socio?> GetByCedulaAndCooperativaAsync(string cedula, int idCooperativa)
        {
            return await _dbSet
                .FirstOrDefaultAsync(s => s.Cedula == cedula && s.IdCooperativa == idCooperativa);
        }
    }
}
