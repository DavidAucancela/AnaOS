using AnaOSProject.Models;

namespace AnaOSProject.Interfaces;

public interface IHistorialSuscripcionRepository : IBaseRepository<HistorialSuscripcion>
{
    Task<IEnumerable<HistorialSuscripcion>> GetBySuscripcionAsync(int idSuscripcion);
}


