using AnaOSProject.Interfaces;
using AnaOSProject.Models;

namespace AnaOSProject.Services
{
    public class SocioService : BaseService<Socio>, ISocioService
    {
        private readonly ISocioRepository _socioRepository;

        public SocioService(ISocioRepository socioRepository) : base(socioRepository)
        {
            _socioRepository = socioRepository;
        }

        public async Task<IEnumerable<Socio>> GetByCooperativaIdAsync(int idCooperativa)
        {
            return await _socioRepository.GetByCooperativaIdAsync(idCooperativa);
        }

        public async Task<Socio?> GetByCedulaAndCooperativaAsync(string cedula, int idCooperativa)
        {
            return await _socioRepository.GetByCedulaAndCooperativaAsync(cedula, idCooperativa);
        }
    }
}
