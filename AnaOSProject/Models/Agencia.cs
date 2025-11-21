using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("agencias")]
public partial class Agencia
{
    [Key]
    [Column("id_agencia")]
    public int IdAgencia { get; set; }

    [Column("id_cooperativa")]
    public int? IdCooperativa { get; set; }

    [Column("nombre")]
    [StringLength(150)]
    public string Nombre { get; set; } = null!;

    [Column("codigo_interno")]
    [StringLength(50)]
    public string? CodigoInterno { get; set; }

    [Column("direccion")]
    [StringLength(200)]
    public string? Direccion { get; set; }

    [Column("telefono")]
    [StringLength(15)]
    public string? Telefono { get; set; }

    [Column("nombre_responsable")]
    [StringLength(50)]
    public string? NombreResponsable { get; set; }

    [Column("provincia")]
    [StringLength(50)]
    public string? Provincia { get; set; }

    [Column("canton")]
    [StringLength(50)]
    public string? Canton { get; set; }

    [Column("ciudad")]
    [StringLength(50)]
    public string? Ciudad { get; set; }

    [Column("hora_apertura")]
    public TimeOnly? HoraApertura { get; set; }

    [Column("hora_cierre")]
    public TimeOnly? HoraCierre { get; set; }

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [ForeignKey("IdCooperativa")]
    [InverseProperty("Agencias")]
    public virtual Cooperativa? IdCooperativaNavigation { get; set; }
}
