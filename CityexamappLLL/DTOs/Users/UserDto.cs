namespace CityexamappLLL.DTOs.Users;

public record UserDto(
    int Id,
    string Name,
    string Email,
    string Phone,
    bool IsPremium,
    string AuthProvider,
    string? ProfileImageUrl
);
