using System.ComponentModel.DataAnnotations;

namespace AnaOSProject.Models.DTOs
{
    public class SocioDTO
    {
        public int IdSocio { get; set; }
        public int IdCooperativa { get; set; }
        public string Cedula { get; set; } = null!;
        public string Nombres { get; set; } = null!;
        public string Apellidos { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Direccion { get; set; }
        public string Estado { get; set; } = "Activo";
        public DateTime? FechaIngreso { get; set; }
        public DateTime? FechaCreacion { get; set; }
    }

    public class SocioCreateDTO
    {
        [Required]
        public int IdCooperativa { get; set; }

        [Required, StringLength(13)]
        public string Cedula { get; set; } = null!;

        [Required, StringLength(100)]
        public string Nombres { get; set; } = null!;

        [Required, StringLength(100)]
        public string Apellidos { get; set; } = null!;

        [StringLength(15)]
        public string? Telefono { get; set; }

        [StringLength(100)]
        public string? Correo { get; set; }

        [StringLength(200)]
        public string? Direccion { get; set; }

        public DateTime? FechaIngreso { get; set; }
    }

    public class SocioUpdateDTO
    {
        [StringLength(100)]
        public string? Nombres { get; set; }

        [StringLength(100)]
        public string? Apellidos { get; set; }

        [StringLength(15)]
        public string? Telefono { get; set; }

        [StringLength(100)]
        public string? Correo { get; set; }

        [StringLength(200)]
        public string? Direccion { get; set; }

        public string? Estado { get; set; }

        public DateTime? FechaIngreso { get; set; }
    }
}
