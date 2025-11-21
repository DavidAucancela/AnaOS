using AnaOSProject.Attributes;
using AnaOSProject.Interfaces;
using AnaOSProject.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnaOSProject.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PlanSuscripcionController : ControllerBase
{
    private readonly IPlanSuscripcionService _planService;

    public PlanSuscripcionController(IPlanSuscripcionService planService)
    {
        _planService = planService;
    }

    // GET: api/PlanSuscripcion
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var planes = await _planService.GetActivePlansAsync();
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = planes });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/PlanSuscripcion/{id}
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var plan = await _planService.GetByIdDTOAsync(id);
            if (plan == null)
                return StatusCode(StatusCodes.Status404NotFound,
                    new { isSuccess = false, message = "Plan no encontrado." });

            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = plan });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/PlanSuscripcion/ByType/{tipoPlan}
    [HttpGet("ByType/{tipoPlan}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByType(string tipoPlan)
    {
        try
        {
            var planes = await _planService.GetPlansByTypeAsync(tipoPlan);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = planes });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // GET: api/PlanSuscripcion/Featured
    [HttpGet("Featured")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeatured()
    {
        try
        {
            var planes = await _planService.GetFeaturedPlansAsync();
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, data = planes });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // POST: api/PlanSuscripcion
    [HttpPost]
    [Authorize]
    [RequireRole("Administrador")]
    public async Task<IActionResult> Create(PlanSuscripcionCreateDTO dto)
    {
        try
        {
            var plan = await _planService.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created,
                new { isSuccess = true, message = "Plan creado exitosamente.", data = plan });
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { isSuccess = false, message = $"Error: {ex.Message}" });
        }
    }

    // PUT: api/PlanSuscripcion/{id}
    [HttpPut("{id:int}")]
    [Authorize]
    [RequireRole("Administrador")]
    public async Task<IActionResult> Update(int id, PlanSuscripcionUpdateDTO dto)
    {
        try
        {
            var plan = await _planService.UpdateAsync(id, dto);
            return StatusCode(StatusCodes.Status200OK,
                new { isSuccess = true, message = "Plan actualizado exitosamente.", data = plan });
        }
        catch (ArgumentException ex)
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
}

