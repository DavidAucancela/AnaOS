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
    public class AgenciaController : ControllerBase
    {
        private readonly IAgenciaService _agenciaService;

        public AgenciaController(IAgenciaService agenciaService)
        {
            _agenciaService = agenciaService;
        }

        // GET: api/Agencia
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var agencias = await _agenciaService.GetAllAsync();
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = agencias });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Agencia/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var agencia = await _agenciaService.GetByIdAsync(id);
                if (agencia == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Agencia no encontrada." });

                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = agencia });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Agencia/ByCooperativa/{idCooperativa}
        [HttpGet("ByCooperativa/{idCooperativa:int}")]
        public async Task<IActionResult> GetByCooperativa(int idCooperativa)
        {
            try
            {
                var agencias = await _agenciaService.GetByCooperativaIdAsync(idCooperativa);
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = agencias });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // GET: api/Agencia/ByCodigoInterno/{codigoInterno}
        [HttpGet("ByCodigoInterno/{codigoInterno}")]
        public async Task<IActionResult> GetByCodigoInterno(string codigoInterno)
        {
            try
            {
                var agencia = await _agenciaService.GetByCodigoInternoAsync(codigoInterno);
                if (agencia == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Agencia no encontrada." });

                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, data = agencia });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // POST: api/Agencia
        [HttpPost]
        public async Task<IActionResult> Create(AgenciaCreateDTO objeto)
        {
            try
            {
                var agencia = new Agencia
                {
                    IdCooperativa = objeto.IdCooperativa,
                    Nombre = objeto.Nombre,
                    CodigoInterno = objeto.CodigoInterno,
                    Direccion = objeto.Direccion,
                    Telefono = objeto.Telefono,
                    NombreResponsable = objeto.NombreResponsable,
                    Provincia = objeto.Provincia,
                    Canton = objeto.Canton,
                    Ciudad = objeto.Ciudad,
                    HoraApertura = objeto.HoraApertura,
                    HoraCierre = objeto.HoraCierre
                };

                var agenciaCreada = await _agenciaService.CreateAsync(agencia);
                return StatusCode(StatusCodes.Status201Created, 
                    new { isSuccess = true, message = "Agencia creada exitosamente.", data = agenciaCreada });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // PUT: api/Agencia/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, AgenciaUpdateDTO objeto)
        {
            try
            {
                var agencia = await _agenciaService.GetByIdAsync(id);
                if (agencia == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Agencia no encontrada." });

                // Verificar si es la agencia matriz
                bool isMatriz = agencia.CodigoInterno?.ToUpper() == "MATRIZ" || 
                               agencia.Nombre?.ToUpper() == "MATRIZ";

                if (!string.IsNullOrEmpty(objeto.Nombre))
                    agencia.Nombre = objeto.Nombre;
                if (objeto.CodigoInterno != null)
                {
                    // No permitir cambiar el código interno de la agencia matriz
                    if (isMatriz && objeto.CodigoInterno.ToUpper() != "MATRIZ")
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, 
                            new { isSuccess = false, message = "No se puede modificar el código interno de la agencia matriz." });
                    }
                    agencia.CodigoInterno = objeto.CodigoInterno;
                }
                if (objeto.Direccion != null)
                    agencia.Direccion = objeto.Direccion;
                if (objeto.Telefono != null)
                    agencia.Telefono = objeto.Telefono;
                if (objeto.NombreResponsable != null)
                    agencia.NombreResponsable = objeto.NombreResponsable;
                if (objeto.Provincia != null)
                    agencia.Provincia = objeto.Provincia;
                if (objeto.Canton != null)
                    agencia.Canton = objeto.Canton;
                if (objeto.Ciudad != null)
                    agencia.Ciudad = objeto.Ciudad;
                if (objeto.HoraApertura.HasValue)
                    agencia.HoraApertura = objeto.HoraApertura;
                if (objeto.HoraCierre.HasValue)
                    agencia.HoraCierre = objeto.HoraCierre;

                await _agenciaService.UpdateAsync(agencia);
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, message = "Agencia actualizada exitosamente.", data = agencia });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }

        // DELETE: api/Agencia/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var agencia = await _agenciaService.GetByIdAsync(id);
                if (agencia == null)
                    return StatusCode(StatusCodes.Status404NotFound, 
                        new { isSuccess = false, message = "Agencia no encontrada." });

                // Verificar si es la agencia matriz (no se puede eliminar)
                if (agencia.CodigoInterno?.ToUpper() == "MATRIZ" || 
                    agencia.Nombre?.ToUpper() == "MATRIZ")
                {
                    return StatusCode(StatusCodes.Status400BadRequest, 
                        new { isSuccess = false, message = "No se puede eliminar la agencia matriz." });
                }

                await _agenciaService.DeleteAsync(id);
                return StatusCode(StatusCodes.Status200OK, 
                    new { isSuccess = true, message = "Agencia eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, 
                    new { isSuccess = false, message = $"Error: {ex.Message}" });
            }
        }
    }
}

