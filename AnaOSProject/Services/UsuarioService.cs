using AnaOSProject.Custom;
using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using System.Linq;

namespace AnaOSProject.Services
{
    public class UsuarioService : BaseService<Usuario>, IUsuarioService
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioService(IUsuarioRepository usuarioRepository) 
            : base(usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<Usuario?> GetByCorreoAsync(string correo)
        {
            return await _usuarioRepository.GetByCorreoAsync(correo);
        }

        public async Task<Usuario?> LoginAsync(string correo, string passwordHash)
        {
            return await _usuarioRepository.GetByCorreoAndPasswordAsync(correo, passwordHash);
        }

        public async Task<bool> ExistsByCorreoAsync(string correo)
        {
            return await _usuarioRepository.ExistsByCorreoAsync(correo);
        }

        public async Task<Usuario> RegisterAsync(UsuarioDTO usuarioDTO)
        {
            // Validar lógica de roles
            var rol = usuarioDTO.Rol ?? "UsuarioCooperativa";
            var idCooperativa = usuarioDTO.IdCooperativa;

            // Si es Administrador o Gerente, no debe tener id_cooperativa
            if ((rol == "Administrador" || rol == "Gerente") && idCooperativa.HasValue)
            {
                throw new InvalidOperationException(
                    $"Los usuarios con rol '{rol}' no pueden estar asociados a una cooperativa.");
            }

            // Si es usuario de cooperativa, debe tener id_cooperativa
            if (rol != "Administrador" && rol != "Gerente" && !idCooperativa.HasValue)
            {
                throw new InvalidOperationException(
                    $"Los usuarios con rol '{rol}' deben estar asociados a una cooperativa.");
            }

            var usuario = new Usuario
            {
                Nombres = usuarioDTO.Nombres,
                Apellidos = usuarioDTO.Apellidos,
                Correo = usuarioDTO.Correo.Trim().ToLower(),
                ContrasenaHash = Utilidades.EncriptarSHA256(usuarioDTO.Contrasena ?? string.Empty),
                Rol = rol,
                IdCooperativa = idCooperativa,
                Cargo = usuarioDTO.Cargo,
                Funcion = usuarioDTO.Funcion,
                Celular = usuarioDTO.Celular,
                ArchivoNombramiento = usuarioDTO.ArchivoNombramiento,
                NombreArchivo = usuarioDTO.NombreArchivo
                // FechaCreacion se establece automáticamente por la base de datos con CURRENT_TIMESTAMP
            };

            return await CreateAsync(usuario);
        }

        public async Task<string> ResetPasswordAsync(string correo)
        {
            var correoNormalizado = correo.Trim().ToLower();
            var usuario = await GetByCorreoAsync(correoNormalizado);

            if (usuario == null)
            {
                throw new InvalidOperationException("El correo electrónico no está registrado en el sistema.");
            }

            // Generar una nueva contraseña aleatoria
            const string caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            var nuevaContrasena = new string(Enumerable.Repeat(caracteres, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            // Hashear la nueva contraseña
            var passwordHash = Utilidades.EncriptarSHA256(nuevaContrasena);

            // Actualizar la contraseña del usuario
            usuario.ContrasenaHash = passwordHash;
            usuario.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

            await UpdateAsync(usuario);

            // Retornar la contraseña en texto plano para enviarla por correo
            return nuevaContrasena;
        }
    }
}

