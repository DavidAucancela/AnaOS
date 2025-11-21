using AnaOSProject.Models;

namespace AnaOSProject.Interfaces
{
    public interface IUsuarioRepository : IBaseRepository<Usuario>
    {
        Task<Usuario?> GetByCorreoAsync(string correo);
        Task<Usuario?> GetByCorreoAndPasswordAsync(string correo, string passwordHash);
        Task<bool> ExistsByCorreoAsync(string correo);
    }
}

