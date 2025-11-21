using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface ICuentaRepository : IBaseRepository<Cuenta>
    {
        Task<Cuenta?> GetByNumeroCuentaAsync(string numeroCuenta);
        Task<IEnumerable<Cuenta>> GetByCooperativaAsync(int idCooperativa);
        Task<bool> ExistsByNumeroCuentaAsync(string numeroCuenta);
        Task<decimal> GetSaldoTotalByCooperativaAsync(int idCooperativa);
    }
}

