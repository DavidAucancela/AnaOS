using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Interfaces;

public interface ISuscripcionService : IBaseService<Suscripcion>
{
    Task<SuscripcionDTO?> GetActiveByCooperativaAsync(int idCooperativa);
    Task<IEnumerable<SuscripcionDTO>> GetByCooperativaAsync(int idCooperativa);
    Task<SuscripcionDTO> CreateAsync(SuscripcionCreateDTO dto, int? idUsuario = null);
    Task<SuscripcionDTO> UpdateAsync(int id, SuscripcionUpdateDTO dto, int? idUsuario = null);
    Task<bool> HasActiveSubscriptionAsync(int idCooperativa);
    Task CancelAsync(int id, int? idUsuario = null);
    Task<IEnumerable<SuscripcionDTO>> GetSubscriptionsExpiringSoonAsync(int days = 30);
    Task<IEnumerable<SuscripcionDTO>> GetSubscriptionsForRenewalAsync();
    Task<SuscripcionDTO> RenewSubscriptionAsync(int id, int? idUsuario = null);
}

