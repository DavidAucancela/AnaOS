using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("suscripciones")]
public partial class Suscripcion
{
    [Key]
    [Column("id_suscripcion")]
    public int IdSuscripcion { get; set; }

    [Column("id_cooperativa")]
    public int IdCooperativa { get; set; }

    [Column("id_plan")]
    public int IdPlan { get; set; }

    [Column("estado")]
    [StringLength(50)]
    public string Estado { get; set; } = null!; // active, canceled, expired, pending, past_due, suspended

    [Column("fecha_inicio", TypeName = "timestamp without time zone")]
    public DateTime FechaInicio { get; set; }

    [Column("fecha_fin", TypeName = "timestamp without time zone")]
    public DateTime FechaFin { get; set; }

    [Column("fecha_cancelacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCancelacion { get; set; }

    [Column("proxima_fecha_cobro", TypeName = "timestamp without time zone")]
    public DateTime ProximaFechaCobro { get; set; }

    [Column("periodo")]
    [StringLength(20)]
    public string Periodo { get; set; } = null!; // monthly, annual

    [Column("monto_pagado", TypeName = "decimal(18,2)")]
    public decimal MontoPagado { get; set; }

    [Column("moneda")]
    [StringLength(3)]
    public string Moneda { get; set; } = "USD";

    [Column("renovacion_automatica")]
    public bool RenovacionAutomatica { get; set; } = true;

    [Column("metodo_pago")]
    [StringLength(100)]
    public string? MetodoPago { get; set; } // Kushki, Comprobante, Transferencia, etc.

    [Column("id_metodo_pago")]
    [StringLength(255)]
    public string? IdMetodoPago { get; set; } // ID del método de pago en el procesador

    [Column("ultimos_4_digitos")]
    [StringLength(4)]
    public string? Ultimos4Digitos { get; set; } // Últimos 4 dígitos de tarjeta si aplica

    [Column("comprobante_pago")]
    public byte[]? ComprobantePago { get; set; }

    [Column("nombre_comprobante")]
    [StringLength(255)]
    public string? NombreComprobante { get; set; }

    [Column("notas")]
    public string? Notas { get; set; } // Notas internas sobre la suscripción

    [Column("motivo_cancelacion")]
    public string? MotivoCancelacion { get; set; } // Razón de cancelación si aplica

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [ForeignKey("IdCooperativa")]
    [InverseProperty("Suscripciones")]
    public virtual Cooperativa IdCooperativaNavigation { get; set; } = null!;

    [ForeignKey("IdPlan")]
    [InverseProperty("Suscripciones")]
    public virtual PlanSuscripcion IdPlanNavigation { get; set; } = null!;

    [InverseProperty("IdSuscripcionNavigation")]
    public virtual ICollection<HistorialSuscripcion> HistorialSuscripciones { get; set; } = new List<HistorialSuscripcion>();
}

