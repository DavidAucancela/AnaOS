using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("cooperativas")]
[Index("Ruc", Name = "cooperativas_ruc_key", IsUnique = true)]
public partial class Cooperativa
{
    [Key]
    [Column("id_cooperativa")]
    public int IdCooperativa { get; set; }

    [Column("nombre")]
    [StringLength(300)]
    public string Nombre { get; set; } = null!;

    [Column("ruc")]
    [StringLength(13)]
    public string Ruc { get; set; } = null!;

    [Column("direccion")]
    [StringLength(300)]
    public string Direccion { get; set; } = null!;

    [Column("telefono")]
    [StringLength(15)]
    public string? Telefono { get; set; }

    [Column("correo")]
    [StringLength(150)]
    public string? Correo { get; set; }

    [Column("archivo_nombramiento")]
    public byte[]? ArchivoNombramiento { get; set; }

    [Column("nombre_archivo")]
    [StringLength(255)]
    public string? NombreArchivo { get; set; }

    [Column("logo")]
    public byte[]? Logo { get; set; }

    [Column("nombre_logo")]
    [StringLength(255)]
    public string? NombreLogo { get; set; }

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [InverseProperty("IdCooperativaNavigation")]
    public virtual ICollection<Agencia> Agencias { get; set; } = new List<Agencia>();

    [InverseProperty("IdCooperativaNavigation")]
    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();

    [InverseProperty("IdCooperativaNavigation")]
    public virtual ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();

    [InverseProperty("IdCooperativaNavigation")]
    public virtual ICollection<Suscripcion> Suscripciones { get; set; } = new List<Suscripcion>();
}
