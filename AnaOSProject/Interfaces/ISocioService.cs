using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface ISocioService : IBaseService<Socio>
    {
        Task<IEnumerable<Socio>> GetByCooperativaIdAsync(int idCooperativa);
        Task<Socio?> GetByCedulaAndCooperativaAsync(string cedula, int idCooperativa);
    }
}
