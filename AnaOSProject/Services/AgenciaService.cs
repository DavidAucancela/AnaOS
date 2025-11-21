using AnaOSProject.Interfaces;
using AnaOSProject.Models;

namespace AnaOSProject.Services
{
    public class AgenciaService : BaseService<Agencia>, IAgenciaService
    {
        private readonly IAgenciaRepository _agenciaRepository;

        public AgenciaService(IAgenciaRepository agenciaRepository) 
            : base(agenciaRepository)
        {
            _agenciaRepository = agenciaRepository;
        }

        public async Task<IEnumerable<Agencia>> GetByCooperativaIdAsync(int idCooperativa)
        {
            return await _agenciaRepository.GetByCooperativaIdAsync(idCooperativa);
        }

        public async Task<Agencia?> GetByCodigoInternoAsync(string codigoInterno)
        {
            return await _agenciaRepository.GetByCodigoInternoAsync(codigoInterno);
        }
    }
}

