using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("usuarios")]
[Index("Correo", Name = "usuarios_correo_key", IsUnique = true)]
public partial class Usuario
{
    [Key]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("id_cooperativa")]
    public int? IdCooperativa { get; set; }

    [Column("nombres")]
    [StringLength(75)]
    public string Nombres { get; set; } = null!;

    [Column("apellidos")]
    [StringLength(75)]
    public string Apellidos { get; set; } = null!;

    [Column("correo")]
    [StringLength(100)]
    public string Correo { get; set; } = null!;

    [Column("contrasena_hash")]
    [StringLength(300)]
    public string ContrasenaHash { get; set; } = null!;

    [Column("cargo")]
    [StringLength(100)]
    public string? Cargo { get; set; }

    [Column("funcion")]
    public string? Funcion { get; set; }

    [Column("rol")]
    [StringLength(50)]
    public string Rol { get; set; } = null!;

    [Column("celular")]
    [StringLength(15)]
    public string? Celular { get; set; }

    [Column("archivo_nombramiento")]
    public byte[]? ArchivoNombramiento { get; set; }

    [Column("nombre_archivo")]
    [StringLength(255)]
    public string? NombreArchivo { get; set; }

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [ForeignKey("IdCooperativa")]
    [InverseProperty("Usuarios")]
    public virtual Cooperativa? IdCooperativaNavigation { get; set; }

    [InverseProperty("IdUsuarioNavigation")]
    public virtual ICollection<HistorialSuscripcion> HistorialSuscripciones { get; set; } = new List<HistorialSuscripcion>();
}
