using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface IAgenciaRepository : IBaseRepository<Agencia>
    {
        Task<IEnumerable<Agencia>> GetByCooperativaIdAsync(int idCooperativa);
        Task<Agencia?> GetByCodigoInternoAsync(string codigoInterno);
    }
}

