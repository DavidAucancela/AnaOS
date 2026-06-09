using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnaOSProject.Models;

[Table("socios")]
public partial class Socio
{
    [Key]
    [Column("id_socio")]
    public int IdSocio { get; set; }

    [Column("id_cooperativa")]
    public int IdCooperativa { get; set; }

    [Column("cedula")]
    [StringLength(13)]
    public string Cedula { get; set; } = null!;

    [Column("nombres")]
    [StringLength(100)]
    public string Nombres { get; set; } = null!;

    [Column("apellidos")]
    [StringLength(100)]
    public string Apellidos { get; set; } = null!;

    [Column("telefono")]
    [StringLength(15)]
    public string? Telefono { get; set; }

    [Column("correo")]
    [StringLength(100)]
    public string? Correo { get; set; }

    [Column("direccion")]
    [StringLength(200)]
    public string? Direccion { get; set; }

    [Column("estado")]
    [StringLength(20)]
    public string Estado { get; set; } = "Activo";

    [Column("fecha_ingreso", TypeName = "timestamp without time zone")]
    public DateTime? FechaIngreso { get; set; }

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [ForeignKey("IdCooperativa")]
    [InverseProperty("Socios")]
    public virtual Cooperativa IdCooperativaNavigation { get; set; } = null!;
}
