using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Repositories
{
    public class CuentaRepository : BaseRepository<Cuenta>, ICuentaRepository
    {
        public CuentaRepository(AnaOSDbContext context) : base(context)
        {
        }

        public async Task<Cuenta?> GetByNumeroCuentaAsync(string numeroCuenta)
        {
            return await _dbSet
                .Include(c => c.IdCooperativaNavigation)
                .FirstOrDefaultAsync(c => c.NumeroCuenta == numeroCuenta);
        }

        public async Task<IEnumerable<Cuenta>> GetByCooperativaAsync(int idCooperativa)
        {
            return await _dbSet
                .Where(c => c.IdCooperativa == idCooperativa)
                .OrderBy(c => c.NumeroCuenta)
                .ToListAsync();
        }

        public async Task<bool> ExistsByNumeroCuentaAsync(string numeroCuenta)
        {
            return await _dbSet.AnyAsync(c => c.NumeroCuenta == numeroCuenta);
        }

        public async Task<decimal> GetSaldoTotalByCooperativaAsync(int idCooperativa)
        {
            return await _dbSet
                .Where(c => c.IdCooperativa == idCooperativa && c.Estado == "Activa")
                .SumAsync(c => c.Saldo);
        }
    }
}

