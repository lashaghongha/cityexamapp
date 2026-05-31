namespace CityexamappLLL.DTOs.Auth;

public record RegisterDto(
    string Name,
    string Email,
    string? Phone,
    string Password
);
