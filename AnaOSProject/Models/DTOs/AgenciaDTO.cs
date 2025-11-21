namespace AnaOSProject.Models.DTOs
{
    public class AgenciaDTO
    {
        public int IdAgencia { get; set; }
        public int? IdCooperativa { get; set; }
        public string Nombre { get; set; } = null!;
        public string? CodigoInterno { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? NombreResponsable { get; set; }
        public string? Provincia { get; set; }
        public string? Canton { get; set; }
        public string? Ciudad { get; set; }
        public TimeOnly? HoraApertura { get; set; }
        public TimeOnly? HoraCierre { get; set; }
    }

    public class AgenciaCreateDTO
    {
        public int? IdCooperativa { get; set; }
        public string Nombre { get; set; } = null!;
        public string? CodigoInterno { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? NombreResponsable { get; set; }
        public string? Provincia { get; set; }
        public string? Canton { get; set; }
        public string? Ciudad { get; set; }
        public TimeOnly? HoraApertura { get; set; }
        public TimeOnly? HoraCierre { get; set; }
    }

    public class AgenciaUpdateDTO
    {
        public string? Nombre { get; set; }
        public string? CodigoInterno { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? NombreResponsable { get; set; }
        public string? Provincia { get; set; }
        public string? Canton { get; set; }
        public string? Ciudad { get; set; }
        public TimeOnly? HoraApertura { get; set; }
        public TimeOnly? HoraCierre { get; set; }
    }
}

