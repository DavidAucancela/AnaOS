namespace AnaOSProject.Models.DTOs
{
    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public int? IdCooperativa { get; set; }
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string? Contrasena { get; set; }
        public string Rol { get; set; } = null!;
        public string? Cargo { get; set; }
        public string? Funcion { get; set; }
        public string? Celular { get; set; }
        public byte[]? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
    }

    public class UsuarioCreateDTO
    {
        public int? IdCooperativa { get; set; }
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Contrasena { get; set; } = null!;
        public string Rol { get; set; } = "UsuarioCooperativa";
        public string? Cargo { get; set; }
        public string? Funcion { get; set; }
        public string? Celular { get; set; }
        public byte[]? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
    }

    public class UsuarioUpdateDTO
    {
        public int? IdCooperativa { get; set; }
        public string? Nombres { get; set; }
        public string? Apellidos { get; set; }
        public string? Contrasena { get; set; }
        public string? Rol { get; set; }
        public string? Cargo { get; set; }
        public string? Funcion { get; set; }
        public string? Celular { get; set; }
        public byte[]? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
    }

    // DTO para registro completo de usuario y cooperativa
    public class RegistroCompletoDTO
    {
        // Datos de Usuario
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Contrasena { get; set; } = null!;
        public string Rol { get; set; } = "Cooperativa";
        public string? Cargo { get; set; }
        public string? Funcion { get; set; }
        public string? Celular { get; set; }

        // Datos de Cooperativa
        public string NombreCooperativa { get; set; } = null!;
        public string Ruc { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string? Telefono { get; set; }
        
        // Archivos (solo uno de nombramiento, compartido entre usuario y cooperativa)
        // Se recibe como base64 string y se convierte a byte[] en el controlador
        public string? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
        
        // Logo de la cooperativa
        // Se recibe como base64 string y se convierte a byte[] en el controlador
        public string? Logo { get; set; }
        public string? NombreLogo { get; set; }
    }
}