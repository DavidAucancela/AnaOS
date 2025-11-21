namespace AnaOSProject.Models.DTOs;

public class HistorialSuscripcionDTO
{
    public int IdHistorial { get; set; }
    public int IdSuscripcion { get; set; }
    public int? IdUsuario { get; set; }
    public string? NombreUsuario { get; set; }
    public string Accion { get; set; } = null!;
    public string? Descripcion { get; set; }
    public string? EstadoAnterior { get; set; }
    public string? EstadoNuevo { get; set; }
    public DateTime FechaCambio { get; set; }
}


