using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Interfaces
{
    public interface IUsuarioService : IBaseService<Usuario>
    {
        Task<Usuario?> GetByCorreoAsync(string correo);
        Task<Usuario?> LoginAsync(string correo, string passwordHash);
        Task<bool> ExistsByCorreoAsync(string correo);
        Task<Usuario> RegisterAsync(UsuarioDTO usuarioDTO);
        Task<string> ResetPasswordAsync(string correo);
    }
}

