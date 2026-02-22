using System;
using System.Collections.Generic;
using AnaOSProject.Models;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Data;

public partial class AnaOSDbContext : DbContext
{
    public AnaOSDbContext()
    {
    }

    public AnaOSDbContext(DbContextOptions<AnaOSDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Agencia> Agencias { get; set; }

    public virtual DbSet<Cooperativa> Cooperativas { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Cuenta> Cuentas { get; set; }

    public virtual DbSet<PlanSuscripcion> PlanesSuscripcion { get; set; }

    public virtual DbSet<Suscripcion> Suscripciones { get; set; }

    public virtual DbSet<HistorialSuscripcion> HistorialSuscripciones { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=AnaOSDB;Username=postgres;Password=admin");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Agencia>(entity =>
        {
            entity.HasKey(e => e.IdAgencia).HasName("agencias_pkey");

            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.IdCooperativaNavigation).WithMany(p => p.Agencias)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("agencias_id_cooperativa_fkey");
        });

        modelBuilder.Entity<Cooperativa>(entity =>
        {
            entity.HasKey(e => e.IdCooperativa).HasName("cooperativas_pkey");

            entity.Property(e => e.FechaActualizacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.IdUsuario).HasName("usuarios_pkey");

            entity.Property(e => e.FechaActualizacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.IdCooperativaNavigation).WithMany(p => p.Usuarios)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("usuarios_id_cooperativa_fkey");

            // Validación de roles: Administrador y Gerente no deben tener id_cooperativa
            entity.ToTable(t => t.HasCheckConstraint("chk_rol_cooperativa", 
                "(rol IN ('Administrador', 'Gerente') AND id_cooperativa IS NULL) OR " +
                "(rol NOT IN ('Administrador', 'Gerente') AND id_cooperativa IS NOT NULL)"));
        });

        modelBuilder.Entity<Cuenta>(entity =>
        {
            entity.HasKey(e => e.IdCuenta).HasName("cuentas_pkey");

            entity.Property(e => e.Saldo).HasPrecision(18, 2);
            entity.Property(e => e.FechaApertura).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaActualizacion).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.IdCooperativaNavigation).WithMany(p => p.Cuentas)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("cuentas_id_cooperativa_fkey");
        });

        modelBuilder.Entity<PlanSuscripcion>(entity =>
        {
            entity.HasKey(e => e.IdPlan).HasName("planes_suscripcion_pkey");

            entity.Property(e => e.PrecioMensual).HasPrecision(18, 2);
            entity.Property(e => e.PrecioAnual).HasPrecision(18, 2);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaActualizacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            
            // Validación de tipo_plan
            entity.ToTable(t => t.HasCheckConstraint("chk_tipo_plan", 
                "tipo_plan IN ('basica', 'professional', 'enterprise', 'custom')"));
        });

        modelBuilder.Entity<Suscripcion>(entity =>
        {
            entity.HasKey(e => e.IdSuscripcion).HasName("suscripciones_pkey");

            entity.Property(e => e.MontoPagado).HasPrecision(18, 2);
            entity.Property(e => e.FechaCreacion).HasDefaultValueSql("CURRENT_TIMESTAMP");
            entity.Property(e => e.FechaActualizacion).HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Validación de estado
            entity.ToTable(t => t.HasCheckConstraint("chk_estado_suscripcion", 
                "estado IN ('active', 'canceled', 'expired', 'pending', 'past_due', 'suspended')"));
            
            // Validación de periodo
            entity.ToTable(t => t.HasCheckConstraint("chk_periodo_suscripcion", 
                "periodo IN ('monthly', 'annual')"));

            entity.HasOne(d => d.IdCooperativaNavigation).WithMany(p => p.Suscripciones)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("suscripciones_id_cooperativa_fkey");

            entity.HasOne(d => d.IdPlanNavigation).WithMany(p => p.Suscripciones)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("suscripciones_id_plan_fkey");
        });

        modelBuilder.Entity<HistorialSuscripcion>(entity =>
        {
            entity.HasKey(e => e.IdHistorial).HasName("historial_suscripciones_pkey");

            entity.Property(e => e.FechaCambio).HasDefaultValueSql("CURRENT_TIMESTAMP");

            entity.HasOne(d => d.IdSuscripcionNavigation).WithMany(p => p.HistorialSuscripciones)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("historial_suscripciones_id_suscripcion_fkey");

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.HistorialSuscripciones)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("historial_suscripciones_id_usuario_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
