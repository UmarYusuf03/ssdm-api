using Microsoft.AspNetCore.Mvc;
using ssdm_api.DTOs;
using ssdm_api.Services;

namespace ssdm_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await authService.RegisterAsync(dto);
        if (result is null)
            return Conflict(new { message = "Email already exists." });
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await authService.LoginAsync(dto);
        if (result is null)
            return Unauthorized(new { message = "Invalid email or password." });
        return Ok(result);
    }
}

