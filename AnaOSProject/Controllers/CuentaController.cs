using AnaOSProject.Interfaces;
using AnaOSProject.Models;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnaOSProject.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CuentaController : ControllerBase
    {
        private readonly ICuentaService _cuentaService;
        private readonly IUsuarioService _usuarioService;

        public CuentaController(ICuentaService cuentaService, IUsuarioService usuarioService)
        {
            _cuentaService = cuentaService;
            _usuarioService = usuarioService;
        }

        // GET: api/Cuenta
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                IEnumerable<Cuenta> cuentas;

                // Administrador y Gerente pueden ver todas las cuentas
                if (usuarioActual.Rol == "Administrador" || usuarioActual.Rol == "Gerente")
                {
                    cuentas = await _cuentaService.GetAllAsync();
                }
                // Usuario de cooperativa solo ve las cuentas de su cooperativa
                else if (usuarioActual.IdCooperativa.HasValue)
                {
                    cuentas = await _cuentaService.GetByCooperativaAsync(usuarioActual.IdCooperativa.Value);
                }
                else
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                        new { isSuccess = false, message = "No tiene permisos para ver cuentas." });
                }

                var cuentasDTO = cuentas.Select(c => new CuentaDTO
                {
                    IdCuenta = c.IdCuenta,
                    IdCooperativa = c.IdCooperativa,
                    NumeroCuenta = c.NumeroCuenta,
                    TipoCuenta = c.TipoCuenta,
                    Saldo = c.Saldo,
                    Moneda = c.Moneda,
                    Estado = c.Estado,
                    FechaApertura = c.FechaApertura,
                    FechaCierre = c.FechaCierre,
                    Descripcion = c.Descripcion
                });

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = cuentasDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cuenta/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByIdAsync(id);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Validar permisos: usuario de cooperativa solo puede ver cuentas de su cooperativa
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != cuenta.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver esta cuenta." });
                    }
                }

                var cuentaDTO = new CuentaDTO
                {
                    IdCuenta = cuenta.IdCuenta,
                    IdCooperativa = cuenta.IdCooperativa,
                    NumeroCuenta = cuenta.NumeroCuenta,
                    TipoCuenta = cuenta.TipoCuenta,
                    Saldo = cuenta.Saldo,
                    Moneda = cuenta.Moneda,
                    Estado = cuenta.Estado,
                    FechaApertura = cuenta.FechaApertura,
                    FechaCierre = cuenta.FechaCierre,
                    Descripcion = cuenta.Descripcion
                };

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = cuentaDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cuenta/ByCooperativa/{idCooperativa}
        [HttpGet("ByCooperativa/{idCooperativa:int}")]
        public async Task<IActionResult> GetByCooperativa(int idCooperativa)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != idCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver estas cuentas." });
                    }
                }

                var cuentas = await _cuentaService.GetByCooperativaAsync(idCooperativa);
                var cuentasDTO = cuentas.Select(c => new CuentaDTO
                {
                    IdCuenta = c.IdCuenta,
                    IdCooperativa = c.IdCooperativa,
                    NumeroCuenta = c.NumeroCuenta,
                    TipoCuenta = c.TipoCuenta,
                    Saldo = c.Saldo,
                    Moneda = c.Moneda,
                    Estado = c.Estado,
                    FechaApertura = c.FechaApertura,
                    FechaCierre = c.FechaCierre,
                    Descripcion = c.Descripcion
                });

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = cuentasDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cuenta/ByNumero/{numeroCuenta}
        [HttpGet("ByNumero/{numeroCuenta}")]
        public async Task<IActionResult> GetByNumeroCuenta(string numeroCuenta)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByNumeroCuentaAsync(numeroCuenta);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != cuenta.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver esta cuenta." });
                    }
                }

                var cuentaDTO = new CuentaDTO
                {
                    IdCuenta = cuenta.IdCuenta,
                    IdCooperativa = cuenta.IdCooperativa,
                    NumeroCuenta = cuenta.NumeroCuenta,
                    TipoCuenta = cuenta.TipoCuenta,
                    Saldo = cuenta.Saldo,
                    Moneda = cuenta.Moneda,
                    Estado = cuenta.Estado,
                    FechaApertura = cuenta.FechaApertura,
                    FechaCierre = cuenta.FechaCierre,
                    Descripcion = cuenta.Descripcion
                };

                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = cuentaDTO });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Cuenta
        [HttpPost]
        public async Task<IActionResult> Create(CuentaCreateDTO objeto)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                // Validar permisos: solo Admin, Gerente o usuarios de la cooperativa pueden crear cuentas
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != objeto.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para crear cuentas en esta cooperativa." });
                    }
                }

                var cuentaCreada = await _cuentaService.CreateAsync(objeto);
                return StatusCode(StatusCodes.Status201Created,
                    new { isSuccess = true, message = "Cuenta creada exitosamente.", data = cuentaCreada });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { isSuccess = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Cuenta/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, CuentaUpdateDTO objeto)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByIdAsync(id);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != cuenta.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para actualizar esta cuenta." });
                    }
                }

                if (!string.IsNullOrEmpty(objeto.TipoCuenta))
                    cuenta.TipoCuenta = objeto.TipoCuenta;
                if (objeto.Saldo.HasValue)
                    await _cuentaService.UpdateSaldoAsync(id, objeto.Saldo.Value);
                if (!string.IsNullOrEmpty(objeto.Moneda))
                    cuenta.Moneda = objeto.Moneda;
                if (!string.IsNullOrEmpty(objeto.Estado))
                    await _cuentaService.CambiarEstadoAsync(id, objeto.Estado);
                if (objeto.Descripcion != null)
                    cuenta.Descripcion = objeto.Descripcion;

                cuenta.FechaActualizacion = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);

                await _cuentaService.UpdateAsync(cuenta);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Cuenta actualizada exitosamente." });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { isSuccess = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Cuenta/{id}/Saldo
        [HttpPut("{id:int}/Saldo")]
        public async Task<IActionResult> UpdateSaldo(int id, [FromBody] decimal nuevoSaldo)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByIdAsync(id);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != cuenta.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para actualizar el saldo de esta cuenta." });
                    }
                }

                await _cuentaService.UpdateSaldoAsync(id, nuevoSaldo);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Saldo actualizado exitosamente." });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { isSuccess = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Cuenta/{id}/Estado
        [HttpPut("{id:int}/Estado")]
        public async Task<IActionResult> CambiarEstado(int id, [FromBody] string nuevoEstado)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByIdAsync(id);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != cuenta.IdCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para cambiar el estado de esta cuenta." });
                    }
                }

                await _cuentaService.CambiarEstadoAsync(id, nuevoEstado);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Estado de cuenta actualizado exitosamente." });
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest,
                    new { isSuccess = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Cuenta/SaldoTotal/{idCooperativa}
        [HttpGet("SaldoTotal/{idCooperativa:int}")]
        public async Task<IActionResult> GetSaldoTotal(int idCooperativa)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                // Validar permisos
                if (usuarioActual.Rol != "Administrador" && usuarioActual.Rol != "Gerente")
                {
                    if (!usuarioActual.IdCooperativa.HasValue || 
                        usuarioActual.IdCooperativa.Value != idCooperativa)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                            new { isSuccess = false, message = "No tiene permisos para ver el saldo total de esta cooperativa." });
                    }
                }

                var saldoTotal = await _cuentaService.GetSaldoTotalByCooperativaAsync(idCooperativa);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, data = new { IdCooperativa = idCooperativa, SaldoTotal = saldoTotal } });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // DELETE: api/Cuenta/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var usuarioActual = await GetUsuarioActualAsync();
                if (usuarioActual == null)
                    return Unauthorized();

                var cuenta = await _cuentaService.GetByIdAsync(id);
                if (cuenta == null)
                    return StatusCode(StatusCodes.Status404NotFound,
                        new { isSuccess = false, message = "Cuenta no encontrada." });

                // Solo Administrador puede eliminar cuentas
                if (usuarioActual.Rol != "Administrador")
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                        new { isSuccess = false, message = "Solo el administrador puede eliminar cuentas." });
                }

                await _cuentaService.DeleteAsync(id);
                return StatusCode(StatusCodes.Status200OK,
                    new { isSuccess = true, message = "Cuenta eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // Método auxiliar para obtener el usuario actual desde el token JWT
        private async Task<Usuario?> GetUsuarioActualAsync()
        {
            var userIdClaim = User.FindFirst("idUsuario");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                return null;

            return await _usuarioService.GetByIdAsync(userId);
        }
    }
}

