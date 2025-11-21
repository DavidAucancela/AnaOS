namespace AnaOSProject.Models.DTOs;

public class PlanSuscripcionDTO
{
    public int IdPlan { get; set; }
    public string Nombre { get; set; } = null!;
    public string TipoPlan { get; set; } = null!; // basica, professional, enterprise, custom
    public string? Descripcion { get; set; }
    public decimal PrecioMensual { get; set; }
    public decimal PrecioAnual { get; set; }
    public string Moneda { get; set; } = "USD";
    
    // Características del plan
    public int? MaxUsuarios { get; set; }
    public int? MaxAgencias { get; set; }
    public int? MaxCuentas { get; set; }
    public int? AlmacenamientoGb { get; set; }
    public bool SoportePrioritario { get; set; }
    public bool ApiAccess { get; set; }
    public bool CustomizacionBranding { get; set; }
    
    public bool Activo { get; set; }
    public bool Destacado { get; set; }
}

public class PlanSuscripcionCreateDTO
{
    public string Nombre { get; set; } = null!;
    public string TipoPlan { get; set; } = null!; // basica, professional, enterprise, custom
    public string? Descripcion { get; set; }
    public decimal PrecioMensual { get; set; }
    public decimal PrecioAnual { get; set; }
    public string Moneda { get; set; } = "USD";
    
    // Características del plan (opcional, principalmente para custom)
    public int? MaxUsuarios { get; set; }
    public int? MaxAgencias { get; set; }
    public int? MaxCuentas { get; set; }
    public int? AlmacenamientoGb { get; set; }
    public bool SoportePrioritario { get; set; } = false;
    public bool ApiAccess { get; set; } = false;
    public bool CustomizacionBranding { get; set; } = false;
    
    public bool Activo { get; set; } = true;
    public bool Destacado { get; set; } = false;
}

public class PlanSuscripcionUpdateDTO
{
    public string? Nombre { get; set; }
    public string? TipoPlan { get; set; }
    public string? Descripcion { get; set; }
    public decimal? PrecioMensual { get; set; }
    public decimal? PrecioAnual { get; set; }
    public string? Moneda { get; set; }
    
    // Características del plan
    public int? MaxUsuarios { get; set; }
    public int? MaxAgencias { get; set; }
    public int? MaxCuentas { get; set; }
    public int? AlmacenamientoGb { get; set; }
    public bool? SoportePrioritario { get; set; }
    public bool? ApiAccess { get; set; }
    public bool? CustomizacionBranding { get; set; }
    
    public bool? Activo { get; set; }
    public bool? Destacado { get; set; }
}

