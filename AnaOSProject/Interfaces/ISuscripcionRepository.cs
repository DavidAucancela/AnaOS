using AnaOSProject.Models;

namespace AnaOSProject.Interfaces;

public interface ISuscripcionRepository : IBaseRepository<Suscripcion>
{
    Task<Suscripcion?> GetActiveByCooperativaAsync(int idCooperativa);
    Task<IEnumerable<Suscripcion>> GetByCooperativaAsync(int idCooperativa);
    Task<bool> HasActiveSubscriptionAsync(int idCooperativa);
    Task<IEnumerable<Suscripcion>> GetSubscriptionsExpiringSoonAsync(int days = 30);
    Task<IEnumerable<Suscripcion>> GetSubscriptionsForRenewalAsync();
}

