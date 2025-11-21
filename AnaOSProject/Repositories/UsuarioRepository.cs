using AnaOSProject.Data;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AnaOSProject.Repositories
{
    public class UsuarioRepository : BaseRepository<Usuario>, IUsuarioRepository
    {
        public UsuarioRepository(AnaOSDbContext context) : base(context)
        {
        }

        public async Task<Usuario?> GetByCorreoAsync(string correo)
        {
            var correoNormalizado = correo.Trim().ToLower();
            // Cargar usuarios y comparar en memoria para garantizar compatibilidad con cualquier formato
            var usuarios = await _dbSet.ToListAsync();
            return usuarios.FirstOrDefault(u => 
                (u.Correo ?? "").Trim().ToLower() == correoNormalizado);
        }

        public async Task<Usuario?> GetByCorreoAndPasswordAsync(string correo, string passwordHash)
        {
            var correoNormalizado = correo.Trim().ToLower();
            // Cargar usuarios y comparar en memoria para garantizar compatibilidad con cualquier formato
            var usuarios = await _dbSet.ToListAsync();
            return usuarios.FirstOrDefault(u => 
                (u.Correo ?? "").Trim().ToLower() == correoNormalizado && 
                u.ContrasenaHash == passwordHash);
        }

        public async Task<bool> ExistsByCorreoAsync(string correo)
        {
            var correoNormalizado = correo.Trim().ToLower();
            // Cargar usuarios y comparar en memoria para garantizar compatibilidad con cualquier formato
            var usuarios = await _dbSet.ToListAsync();
            return usuarios.Any(u => 
                (u.Correo ?? "").Trim().ToLower() == correoNormalizado);
        }
    }
}

