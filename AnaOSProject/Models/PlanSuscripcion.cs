using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("planes_suscripcion")]
public partial class PlanSuscripcion
{
    [Key]
    [Column("id_plan")]
    public int IdPlan { get; set; }

    [Column("nombre")]
    [StringLength(100)]
    public string Nombre { get; set; } = null!;

    [Column("tipo_plan")]
    [StringLength(20)]
    public string TipoPlan { get; set; } = null!; // basica, professional, enterprise, custom

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("precio_mensual", TypeName = "decimal(18,2)")]
    public decimal PrecioMensual { get; set; }

    [Column("precio_anual", TypeName = "decimal(18,2)")]
    public decimal PrecioAnual { get; set; }

    [Column("moneda")]
    [StringLength(3)]
    public string Moneda { get; set; } = "USD";

    // Características del plan (para planes custom)
    [Column("max_usuarios")]
    public int? MaxUsuarios { get; set; }

    [Column("max_agencias")]
    public int? MaxAgencias { get; set; }

    [Column("max_cuentas")]
    public int? MaxCuentas { get; set; }

    [Column("almacenamiento_gb")]
    public int? AlmacenamientoGb { get; set; }

    [Column("soporte_prioritario")]
    public bool SoportePrioritario { get; set; } = false;

    [Column("api_access")]
    public bool ApiAccess { get; set; } = false;

    [Column("customizacion_branding")]
    public bool CustomizacionBranding { get; set; } = false;

    [Column("activo")]
    public bool Activo { get; set; } = true;

    [Column("destacado")]
    public bool Destacado { get; set; } = false;

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [InverseProperty("IdPlanNavigation")]
    public virtual ICollection<Suscripcion> Suscripciones { get; set; } = new List<Suscripcion>();
}

