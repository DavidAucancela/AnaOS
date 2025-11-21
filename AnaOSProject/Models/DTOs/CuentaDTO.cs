namespace AnaOSProject.Models.DTOs
{
    public class CuentaDTO
    {
        public int IdCuenta { get; set; }
        public int IdCooperativa { get; set; }
        public string NumeroCuenta { get; set; } = null!;
        public string TipoCuenta { get; set; } = null!;
        public decimal Saldo { get; set; }
        public string Moneda { get; set; } = "USD";
        public string Estado { get; set; } = "Activa";
        public DateTime? FechaApertura { get; set; }
        public DateTime? FechaCierre { get; set; }
        public string? Descripcion { get; set; }
    }

    public class CuentaCreateDTO
    {
        public int IdCooperativa { get; set; }
        public string NumeroCuenta { get; set; } = null!;
        public string TipoCuenta { get; set; } = null!;
        public decimal Saldo { get; set; } = 0.00m;
        public string Moneda { get; set; } = "USD";
        public string Estado { get; set; } = "Activa";
        public string? Descripcion { get; set; }
    }

    public class CuentaUpdateDTO
    {
        public string? TipoCuenta { get; set; }
        public decimal? Saldo { get; set; }
        public string? Moneda { get; set; }
        public string? Estado { get; set; }
        public DateTime? FechaCierre { get; set; }
        public string? Descripcion { get; set; }
    }

    public class CuentaSaldoDTO
    {
        public int IdCuenta { get; set; }
        public string NumeroCuenta { get; set; } = null!;
        public decimal Saldo { get; set; }
        public string Moneda { get; set; } = "USD";
        public string Estado { get; set; } = null!;
    }
}

