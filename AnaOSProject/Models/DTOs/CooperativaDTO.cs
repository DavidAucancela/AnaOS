namespace AnaOSProject.Models.DTOs
{
    public class CooperativaDTO
    {
        public int IdCooperativa { get; set; }
        public string Nombre { get; set; } = null!;
        public string Ruc { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public byte[]? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
        public byte[]? Logo { get; set; }
        public string? NombreLogo { get; set; }
    }

    public class CooperativaCreateDTO
    {
        public string Nombre { get; set; } = null!;
        public string Ruc { get; set; } = null!;
        public string Direccion { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public byte[]? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
        public byte[]? Logo { get; set; }
        public string? NombreLogo { get; set; }
    }

    public class CooperativaUpdateDTO
    {
        public string? Nombre { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        // Se recibe como base64 string y se convierte a byte[] en el controlador
        public string? ArchivoNombramiento { get; set; }
        public string? NombreArchivo { get; set; }
        // Se recibe como base64 string y se convierte a byte[] en el controlador
        public string? Logo { get; set; }
        public string? NombreLogo { get; set; }
    }
}

