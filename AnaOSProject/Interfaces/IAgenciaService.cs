using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface IAgenciaService : IBaseService<Agencia>
    {
        Task<IEnumerable<Agencia>> GetByCooperativaIdAsync(int idCooperativa);
        Task<Agencia?> GetByCodigoInternoAsync(string codigoInterno);
    }
}

