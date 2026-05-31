using CityexamappLLL.DTOs.Auth;

namespace CityexamappLLL.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto?> GoogleLoginAsync(string idToken);
    Task<AuthResponseDto?> GetMeAsync(int userId);
}
