namespace AnaOSProject.Models.DTOs;

public class SuscripcionDTO
{
    public int IdSuscripcion { get; set; }
    public int IdCooperativa { get; set; }
    public string? NombreCooperativa { get; set; }
    public int IdPlan { get; set; }
    public string? NombrePlan { get; set; }
    public string? TipoPlan { get; set; }
    public string Estado { get; set; } = null!;
    public string Periodo { get; set; } = null!;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public DateTime? FechaCancelacion { get; set; }
    public DateTime ProximaFechaCobro { get; set; }
    public decimal MontoPagado { get; set; }
    public string Moneda { get; set; } = "USD";
    public bool RenovacionAutomatica { get; set; }
    public string? MetodoPago { get; set; }
    public string? IdMetodoPago { get; set; }
    public string? Ultimos4Digitos { get; set; }
    public string? NombreComprobante { get; set; }
    public string? Notas { get; set; }
    public string? MotivoCancelacion { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public DateTime? FechaActualizacion { get; set; }
    
    // Campos calculados útiles
    public int? DiasRestantes { get; set; }
    public bool EstaPorVencer { get; set; }
}

public class SuscripcionCreateDTO
{
    public int IdCooperativa { get; set; }
    public int IdPlan { get; set; }
    public string Periodo { get; set; } = null!; // monthly, annual
    public decimal MontoPagado { get; set; }
    public string Moneda { get; set; } = "USD";
    public bool RenovacionAutomatica { get; set; } = true;
    public string? MetodoPago { get; set; }
    public string? IdMetodoPago { get; set; }
    public string? Ultimos4Digitos { get; set; }
    public string? ComprobantePago { get; set; } // base64
    public string? NombreComprobante { get; set; }
    public string? Notas { get; set; }
}

public class SuscripcionUpdateDTO
{
    public int? IdPlan { get; set; }
    public string? Estado { get; set; }
    public string? Periodo { get; set; }
    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
    public DateTime? FechaCancelacion { get; set; }
    public DateTime? ProximaFechaCobro { get; set; }
    public decimal? MontoPagado { get; set; }
    public string? Moneda { get; set; }
    public bool? RenovacionAutomatica { get; set; }
    public string? MetodoPago { get; set; }
    public string? IdMetodoPago { get; set; }
    public string? Ultimos4Digitos { get; set; }
    public string? ComprobantePago { get; set; } // base64
    public string? NombreComprobante { get; set; }
    public string? Notas { get; set; }
    public string? MotivoCancelacion { get; set; }
}

