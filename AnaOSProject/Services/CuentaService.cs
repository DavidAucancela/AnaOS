using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;

namespace AnaOSProject.Services
{
    public class CuentaService : BaseService<Cuenta>, ICuentaService
    {
        private readonly ICuentaRepository _cuentaRepository;
        private readonly ICooperativaRepository _cooperativaRepository;

        public CuentaService(
            ICuentaRepository cuentaRepository,
            ICooperativaRepository cooperativaRepository) 
            : base(cuentaRepository)
        {
            _cuentaRepository = cuentaRepository;
            _cooperativaRepository = cooperativaRepository;
        }

        public async Task<Cuenta?> GetByNumeroCuentaAsync(string numeroCuenta)
        {
            return await _cuentaRepository.GetByNumeroCuentaAsync(numeroCuenta);
        }

        public async Task<IEnumerable<Cuenta>> GetByCooperativaAsync(int idCooperativa)
        {
            return await _cuentaRepository.GetByCooperativaAsync(idCooperativa);
        }

        public async Task<bool> ExistsByNumeroCuentaAsync(string numeroCuenta)
        {
            return await _cuentaRepository.ExistsByNumeroCuentaAsync(numeroCuenta);
        }

        public async Task<Cuenta> CreateAsync(CuentaCreateDTO cuentaDTO)
        {
            // Validar que el número de cuenta sea único
            if (await ExistsByNumeroCuentaAsync(cuentaDTO.NumeroCuenta))
            {
                throw new InvalidOperationException(
                    $"Ya existe una cuenta con el número '{cuentaDTO.NumeroCuenta}'.");
            }

            // Validar que la cooperativa existe
            var cooperativa = await _cooperativaRepository.GetByIdAsync(cuentaDTO.IdCooperativa);
            if (cooperativa == null)
            {
                throw new InvalidOperationException(
                    $"La cooperativa con ID {cuentaDTO.IdCooperativa} no existe.");
            }

            // Validar que el saldo inicial no sea negativo
            if (cuentaDTO.Saldo < 0)
            {
                throw new InvalidOperationException(
                    "El saldo inicial no puede ser negativo.");
            }

            var cuenta = new Cuenta
            {
                IdCooperativa = cuentaDTO.IdCooperativa,
                NumeroCuenta = cuentaDTO.NumeroCuenta.Trim(),
                TipoCuenta = cuentaDTO.TipoCuenta,
                Saldo = cuentaDTO.Saldo,
                Moneda = cuentaDTO.Moneda ?? "USD",
                Estado = cuentaDTO.Estado ?? "Activa",
                Descripcion = cuentaDTO.Descripcion,
                FechaApertura = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified)
            };

            return await CreateAsync(cuenta);
        }

        public async Task UpdateSaldoAsync(int idCuenta, decimal nuevoSaldo)
        {
            var cuenta = await GetByIdAsync(idCuenta);
            if (cuenta == null)
            {
                throw new InvalidOperationException($"La cuenta con ID {idCuenta} no existe.");
            }

            if (cuenta.Estado != "Activa")
            {
                throw new InvalidOperationException(
                    $"No se puede actualizar el saldo de una cuenta con estado '{cuenta.Estado}'.");
            }

            // Validar que el saldo no sea negativo (puedes ajustar esta lógica según tus reglas)
            if (nuevoSaldo < 0)
            {
                throw new InvalidOperationException("El saldo no puede ser negativo.");
            }

            cuenta.Saldo = nuevoSaldo;
            cuenta.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

            await UpdateAsync(cuenta);
        }

        public async Task CambiarEstadoAsync(int idCuenta, string nuevoEstado)
        {
            var cuenta = await GetByIdAsync(idCuenta);
            if (cuenta == null)
            {
                throw new InvalidOperationException($"La cuenta con ID {idCuenta} no existe.");
            }

            var estadosValidos = new[] { "Activa", "Inactiva", "Bloqueada", "Cerrada" };
            if (!estadosValidos.Contains(nuevoEstado))
            {
                throw new InvalidOperationException(
                    $"El estado '{nuevoEstado}' no es válido. Estados válidos: {string.Join(", ", estadosValidos)}");
            }

            cuenta.Estado = nuevoEstado;
            
            if (nuevoEstado == "Cerrada")
            {
                cuenta.FechaCierre = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
            }

            cuenta.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

            await UpdateAsync(cuenta);
        }

        public async Task<decimal> GetSaldoTotalByCooperativaAsync(int idCooperativa)
        {
            return await _cuentaRepository.GetSaldoTotalByCooperativaAsync(idCooperativa);
        }
    }
}

