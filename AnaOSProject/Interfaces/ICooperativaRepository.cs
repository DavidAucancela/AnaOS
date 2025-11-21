using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface ICooperativaRepository : IBaseRepository<Cooperativa>
    {
        Task<Cooperativa?> GetByRucAsync(string ruc);
        Task<bool> ExistsByRucAsync(string ruc);
    }
}

