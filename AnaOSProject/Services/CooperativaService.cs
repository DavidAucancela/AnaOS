using AnaOSProject.Interfaces;
using AnaOSProject.Models;

namespace AnaOSProject.Services
{
    public class CooperativaService : BaseService<Cooperativa>, ICooperativaService
    {
        private readonly ICooperativaRepository _cooperativaRepository;

        public CooperativaService(ICooperativaRepository cooperativaRepository) 
            : base(cooperativaRepository)
        {
            _cooperativaRepository = cooperativaRepository;
        }

        public async Task<Cooperativa?> GetByRucAsync(string ruc)
        {
            return await _cooperativaRepository.GetByRucAsync(ruc);
        }

        public async Task<bool> ExistsByRucAsync(string ruc)
        {
            return await _cooperativaRepository.ExistsByRucAsync(ruc);
        }
    }
}

