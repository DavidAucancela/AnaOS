using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Interfaces
{
    public interface ICuentaService : IBaseService<Cuenta>
    {
        Task<Cuenta?> GetByNumeroCuentaAsync(string numeroCuenta);
        Task<IEnumerable<Cuenta>> GetByCooperativaAsync(int idCooperativa);
        Task<bool> ExistsByNumeroCuentaAsync(string numeroCuenta);
        Task<Cuenta> CreateAsync(CuentaCreateDTO cuentaDTO);
        Task UpdateSaldoAsync(int idCuenta, decimal nuevoSaldo);
        Task CambiarEstadoAsync(int idCuenta, string nuevoEstado);
        Task<decimal> GetSaldoTotalByCooperativaAsync(int idCooperativa);
    }
}

