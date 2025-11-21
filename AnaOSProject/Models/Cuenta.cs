using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Models;

[Table("cuentas")]
[Index("NumeroCuenta", Name = "cuentas_numero_cuenta_key", IsUnique = true)]
public partial class Cuenta
{
    [Key]
    [Column("id_cuenta")]
    public int IdCuenta { get; set; }

    [Column("id_cooperativa")]
    public int IdCooperativa { get; set; }

    [Column("numero_cuenta")]
    [StringLength(50)]
    public string NumeroCuenta { get; set; } = null!;

    [Column("tipo_cuenta")]
    [StringLength(50)]
    public string TipoCuenta { get; set; } = null!;

    [Column("saldo", TypeName = "decimal(18,2)")]
    public decimal Saldo { get; set; } = 0.00m;

    [Column("moneda")]
    [StringLength(10)]
    public string Moneda { get; set; } = "USD";

    [Column("estado")]
    [StringLength(20)]
    public string Estado { get; set; } = "Activa";

    [Column("fecha_apertura", TypeName = "timestamp without time zone")]
    public DateTime? FechaApertura { get; set; }

    [Column("fecha_cierre", TypeName = "timestamp without time zone")]
    public DateTime? FechaCierre { get; set; }

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("fecha_creacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaCreacion { get; set; }

    [Column("fecha_actualizacion", TypeName = "timestamp without time zone")]
    public DateTime? FechaActualizacion { get; set; }

    [ForeignKey("IdCooperativa")]
    [InverseProperty("Cuentas")]
    public virtual Cooperativa IdCooperativaNavigation { get; set; } = null!;
}

