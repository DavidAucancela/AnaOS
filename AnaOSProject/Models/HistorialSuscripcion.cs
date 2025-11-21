using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("historial_suscripciones")]
public partial class HistorialSuscripcion
{
    [Key]
    [Column("id_historial")]
    public int IdHistorial { get; set; }

    [Column("id_suscripcion")]
    public int IdSuscripcion { get; set; }

    [Column("id_usuario")]
    public int? IdUsuario { get; set; }

    [Column("accion")]
    [StringLength(100)]
    public string Accion { get; set; } = null!; // Creación, Actualización, Cancelación, Renovación, Cambio de Plan

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("estado_anterior")]
    [StringLength(50)]
    public string? EstadoAnterior { get; set; }

    [Column("estado_nuevo")]
    [StringLength(50)]
    public string? EstadoNuevo { get; set; }

    [Column("fecha_cambio", TypeName = "timestamp without time zone")]
    public DateTime FechaCambio { get; set; }

    [ForeignKey("IdSuscripcion")]
    [InverseProperty("HistorialSuscripciones")]
    public virtual Suscripcion IdSuscripcionNavigation { get; set; } = null!;

    [ForeignKey("IdUsuario")]
    [InverseProperty("HistorialSuscripciones")]
    public virtual Usuario? IdUsuarioNavigation { get; set; }
}


