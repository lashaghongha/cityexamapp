using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CityexamappLLL.Services;
using CityexamappLLL.DTOs.Auth;

namespace CityexamappLLL.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        if (result == null)
            return BadRequest(new { message = "Email უკვე გამოყენებულია" });
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        if (result == null)
            return Unauthorized(new { message = "Email ან პაროლი არასწორია" });
        return Ok(result);
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin(GoogleLoginDto dto)
    {
        var result = await _auth.GoogleLoginAsync(dto.IdToken);
        if (result == null)
            return Unauthorized(new { message = "Google token არავალიდურია" });
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _auth.GetMeAsync(userId);
        if (result == null) return Unauthorized();
        return Ok(result);
    }
}
