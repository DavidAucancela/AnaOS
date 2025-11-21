using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface ICooperativaService : IBaseService<Cooperativa>
    {
        Task<Cooperativa?> GetByRucAsync(string ruc);
        Task<bool> ExistsByRucAsync(string ruc);
    }
}

