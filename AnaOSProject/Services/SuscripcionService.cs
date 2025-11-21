using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace AnaOSProject.Services;

public class SuscripcionService : BaseService<Suscripcion>, ISuscripcionService
{
    private readonly ISuscripcionRepository _suscripcionRepository;
    private readonly IBaseRepository<PlanSuscripcion> _planRepository;
    private readonly IBaseRepository<HistorialSuscripcion> _historialRepository;
    private readonly IBaseRepository<Cooperativa> _cooperativaRepository;

    public SuscripcionService(
        ISuscripcionRepository suscripcionRepository,
        IBaseRepository<PlanSuscripcion> planRepository,
        IBaseRepository<HistorialSuscripcion> historialRepository,
        IBaseRepository<Cooperativa> cooperativaRepository) 
        : base(suscripcionRepository)
    {
        _suscripcionRepository = suscripcionRepository;
        _planRepository = planRepository;
        _historialRepository = historialRepository;
        _cooperativaRepository = cooperativaRepository;
    }

    public async Task<SuscripcionDTO?> GetActiveByCooperativaAsync(int idCooperativa)
    {
        var suscripcion = await _suscripcionRepository.GetActiveByCooperativaAsync(idCooperativa);
        if (suscripcion == null) return null;

        return MapToDTO(suscripcion);
    }

    public async Task<IEnumerable<SuscripcionDTO>> GetByCooperativaAsync(int idCooperativa)
    {
        var suscripciones = await _suscripcionRepository.GetByCooperativaAsync(idCooperativa);
        return suscripciones.Select(MapToDTO);
    }

    public async Task<SuscripcionDTO> CreateAsync(SuscripcionCreateDTO dto, int? idUsuario = null)
    {
        var plan = await _planRepository.GetByIdAsync(dto.IdPlan);
        if (plan == null)
            throw new ArgumentException("Plan de suscripción no encontrado");

        var cooperativa = await _cooperativaRepository.GetByIdAsync(dto.IdCooperativa);
        if (cooperativa == null)
            throw new ArgumentException("Cooperativa no encontrada");

        // Cancelar suscripciones activas anteriores
        var suscripcionesActivas = await _suscripcionRepository.FindAsync(s => 
            s.IdCooperativa == dto.IdCooperativa && 
            s.Estado == "active");
        
        foreach (var suscripcionActiva in suscripcionesActivas)
        {
            suscripcionActiva.Estado = "canceled";
            suscripcionActiva.FechaCancelacion = DateTime.UtcNow;
            suscripcionActiva.FechaActualizacion = DateTime.UtcNow;
            await _suscripcionRepository.UpdateAsync(suscripcionActiva);
        }

        // Normalizar periodo a inglés si viene en español
        var periodo = dto.Periodo.ToLower();
        if (periodo == "anual" || periodo == "annual")
            periodo = "annual";
        else if (periodo == "mensual" || periodo == "monthly")
            periodo = "monthly";
        else
            periodo = dto.Periodo.ToLower();

        // Calcular fechas
        var fechaInicio = DateTime.UtcNow;
        var fechaFin = periodo == "annual" 
            ? fechaInicio.AddYears(1) 
            : fechaInicio.AddMonths(1);
        
        // Calcular próxima fecha de cobro (igual a fecha fin si es renovación automática)
        var proximaFechaCobro = dto.RenovacionAutomatica ? fechaFin : fechaFin;

        var suscripcion = new Suscripcion
        {
            IdCooperativa = dto.IdCooperativa,
            IdPlan = dto.IdPlan,
            Estado = "pending", // Se activará cuando se confirme el pago
            Periodo = periodo,
            FechaInicio = fechaInicio,
            FechaFin = fechaFin,
            ProximaFechaCobro = proximaFechaCobro,
            MontoPagado = dto.MontoPagado,
            Moneda = dto.Moneda ?? "USD",
            RenovacionAutomatica = dto.RenovacionAutomatica,
            MetodoPago = dto.MetodoPago,
            IdMetodoPago = dto.IdMetodoPago,
            Ultimos4Digitos = dto.Ultimos4Digitos,
            NombreComprobante = dto.NombreComprobante,
            Notas = dto.Notas,
            FechaCreacion = DateTime.UtcNow,
            FechaActualizacion = DateTime.UtcNow
        };

        // Convertir comprobante de base64 a byte[]
        if (!string.IsNullOrEmpty(dto.ComprobantePago))
        {
            suscripcion.ComprobantePago = Convert.FromBase64String(dto.ComprobantePago);
        }

        var nuevaSuscripcion = await _suscripcionRepository.AddAsync(suscripcion);

        // Crear registro en historial
        var historial = new HistorialSuscripcion
        {
            IdSuscripcion = nuevaSuscripcion.IdSuscripcion,
            IdUsuario = idUsuario,
            Accion = "Creación",
            Descripcion = $"Suscripción creada para el plan {plan.Nombre}",
            EstadoNuevo = "pending",
            FechaCambio = DateTime.UtcNow
        };
        await _historialRepository.AddAsync(historial);

        return MapToDTO(nuevaSuscripcion);
    }

    public async Task<SuscripcionDTO> UpdateAsync(int id, SuscripcionUpdateDTO dto, int? idUsuario = null)
    {
        var suscripcion = await _suscripcionRepository.GetByIdAsync(id);
        if (suscripcion == null)
            throw new ArgumentException("Suscripción no encontrada");

        var estadoAnterior = suscripcion.Estado;

        // Actualizar campos
        if (dto.IdPlan.HasValue)
            suscripcion.IdPlan = dto.IdPlan.Value;
        if (!string.IsNullOrEmpty(dto.Estado))
        {
            var nuevoEstado = dto.Estado.ToLower();
            // Si se cancela, registrar fecha de cancelación
            if (nuevoEstado == "canceled" && suscripcion.Estado != "canceled")
                suscripcion.FechaCancelacion = DateTime.UtcNow;
            suscripcion.Estado = nuevoEstado;
        }
        if (!string.IsNullOrEmpty(dto.Periodo))
        {
            var periodo = dto.Periodo.ToLower();
            if (periodo == "anual" || periodo == "annual")
                periodo = "annual";
            else if (periodo == "mensual" || periodo == "monthly")
                periodo = "monthly";
            suscripcion.Periodo = periodo;
        }
        if (dto.FechaInicio.HasValue)
            suscripcion.FechaInicio = dto.FechaInicio.Value;
        if (dto.FechaFin.HasValue)
            suscripcion.FechaFin = dto.FechaFin.Value;
        if (dto.FechaCancelacion.HasValue)
            suscripcion.FechaCancelacion = dto.FechaCancelacion.Value;
        if (dto.ProximaFechaCobro.HasValue)
            suscripcion.ProximaFechaCobro = dto.ProximaFechaCobro.Value;
        if (dto.MontoPagado.HasValue)
            suscripcion.MontoPagado = dto.MontoPagado.Value;
        if (!string.IsNullOrEmpty(dto.Moneda))
            suscripcion.Moneda = dto.Moneda;
        if (dto.RenovacionAutomatica.HasValue)
            suscripcion.RenovacionAutomatica = dto.RenovacionAutomatica.Value;
        if (!string.IsNullOrEmpty(dto.MetodoPago))
            suscripcion.MetodoPago = dto.MetodoPago;
        if (!string.IsNullOrEmpty(dto.IdMetodoPago))
            suscripcion.IdMetodoPago = dto.IdMetodoPago;
        if (!string.IsNullOrEmpty(dto.Ultimos4Digitos))
            suscripcion.Ultimos4Digitos = dto.Ultimos4Digitos;
        if (!string.IsNullOrEmpty(dto.NombreComprobante))
            suscripcion.NombreComprobante = dto.NombreComprobante;
        if (!string.IsNullOrEmpty(dto.ComprobantePago))
            suscripcion.ComprobantePago = Convert.FromBase64String(dto.ComprobantePago);
        if (!string.IsNullOrEmpty(dto.Notas))
            suscripcion.Notas = dto.Notas;
        if (!string.IsNullOrEmpty(dto.MotivoCancelacion))
            suscripcion.MotivoCancelacion = dto.MotivoCancelacion;

        suscripcion.FechaActualizacion = DateTime.UtcNow;

        await _suscripcionRepository.UpdateAsync(suscripcion);

        // Crear registro en historial
        var historial = new HistorialSuscripcion
        {
            IdSuscripcion = suscripcion.IdSuscripcion,
            IdUsuario = idUsuario,
            Accion = "Actualización",
            Descripcion = "Suscripción actualizada",
            EstadoAnterior = estadoAnterior,
            EstadoNuevo = suscripcion.Estado,
            FechaCambio = DateTime.UtcNow
        };
        await _historialRepository.AddAsync(historial);

        return MapToDTO(suscripcion);
    }

    public async Task<bool> HasActiveSubscriptionAsync(int idCooperativa)
    {
        return await _suscripcionRepository.HasActiveSubscriptionAsync(idCooperativa);
    }

    public async Task CancelAsync(int id, int? idUsuario = null)
    {
        var suscripcion = await _suscripcionRepository.GetByIdAsync(id);
        if (suscripcion == null)
            throw new ArgumentException("Suscripción no encontrada");

        var estadoAnterior = suscripcion.Estado;
        suscripcion.Estado = "canceled";
        suscripcion.FechaCancelacion = DateTime.UtcNow;
        suscripcion.FechaActualizacion = DateTime.UtcNow;

        await _suscripcionRepository.UpdateAsync(suscripcion);

        // Crear registro en historial
        var historial = new HistorialSuscripcion
        {
            IdSuscripcion = suscripcion.IdSuscripcion,
            IdUsuario = idUsuario,
            Accion = "Cancelación",
            Descripcion = "Suscripción cancelada",
            EstadoAnterior = estadoAnterior,
            EstadoNuevo = "canceled",
            FechaCambio = DateTime.UtcNow
        };
        await _historialRepository.AddAsync(historial);
    }

    public async Task<IEnumerable<SuscripcionDTO>> GetSubscriptionsExpiringSoonAsync(int days = 30)
    {
        var suscripciones = await _suscripcionRepository.GetSubscriptionsExpiringSoonAsync(days);
        return suscripciones.Select(MapToDTO);
    }

    public async Task<IEnumerable<SuscripcionDTO>> GetSubscriptionsForRenewalAsync()
    {
        var suscripciones = await _suscripcionRepository.GetSubscriptionsForRenewalAsync();
        return suscripciones.Select(MapToDTO);
    }

    public async Task<SuscripcionDTO> RenewSubscriptionAsync(int id, int? idUsuario = null)
    {
        var suscripcion = await _suscripcionRepository.GetByIdAsync(id);
        if (suscripcion == null)
            throw new ArgumentException("Suscripción no encontrada");

        if (suscripcion.Estado != "active")
            throw new InvalidOperationException("Solo se pueden renovar suscripciones activas");

        var estadoAnterior = suscripcion.Estado;
        var fechaFinAnterior = suscripcion.FechaFin;

        // Extender la suscripción según el periodo
        if (suscripcion.Periodo == "annual")
        {
            suscripcion.FechaFin = suscripcion.FechaFin.AddYears(1);
            suscripcion.ProximaFechaCobro = suscripcion.FechaFin;
        }
        else
        {
            suscripcion.FechaFin = suscripcion.FechaFin.AddMonths(1);
            suscripcion.ProximaFechaCobro = suscripcion.FechaFin;
        }

        suscripcion.FechaActualizacion = DateTime.UtcNow;
        await _suscripcionRepository.UpdateAsync(suscripcion);

        // Crear registro en historial
        var historial = new HistorialSuscripcion
        {
            IdSuscripcion = suscripcion.IdSuscripcion,
            IdUsuario = idUsuario,
            Accion = "Renovación",
            Descripcion = $"Suscripción renovada. Nueva fecha fin: {suscripcion.FechaFin:yyyy-MM-dd}",
            EstadoAnterior = estadoAnterior,
            EstadoNuevo = suscripcion.Estado,
            FechaCambio = DateTime.UtcNow
        };
        await _historialRepository.AddAsync(historial);

        return MapToDTO(suscripcion);
    }

    private SuscripcionDTO MapToDTO(Suscripcion suscripcion)
    {
        var diasRestantes = suscripcion.FechaFin > DateTime.UtcNow 
            ? (int)(suscripcion.FechaFin - DateTime.UtcNow).TotalDays 
            : 0;

        return new SuscripcionDTO
        {
            IdSuscripcion = suscripcion.IdSuscripcion,
            IdCooperativa = suscripcion.IdCooperativa,
            NombreCooperativa = suscripcion.IdCooperativaNavigation?.Nombre,
            IdPlan = suscripcion.IdPlan,
            NombrePlan = suscripcion.IdPlanNavigation?.Nombre,
            TipoPlan = suscripcion.IdPlanNavigation?.TipoPlan,
            Estado = suscripcion.Estado,
            Periodo = suscripcion.Periodo,
            FechaInicio = suscripcion.FechaInicio,
            FechaFin = suscripcion.FechaFin,
            FechaCancelacion = suscripcion.FechaCancelacion,
            ProximaFechaCobro = suscripcion.ProximaFechaCobro,
            MontoPagado = suscripcion.MontoPagado,
            Moneda = suscripcion.Moneda,
            RenovacionAutomatica = suscripcion.RenovacionAutomatica,
            MetodoPago = suscripcion.MetodoPago,
            IdMetodoPago = suscripcion.IdMetodoPago,
            Ultimos4Digitos = suscripcion.Ultimos4Digitos,
            NombreComprobante = suscripcion.NombreComprobante,
            Notas = suscripcion.Notas,
            MotivoCancelacion = suscripcion.MotivoCancelacion,
            FechaCreacion = suscripcion.FechaCreacion,
            FechaActualizacion = suscripcion.FechaActualizacion,
            DiasRestantes = diasRestantes,
            EstaPorVencer = diasRestantes > 0 && diasRestantes <= 30
        };
    }
}

