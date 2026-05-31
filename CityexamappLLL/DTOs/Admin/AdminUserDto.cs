namespace CityexamappLLL.DTOs.Admin;

public record AdminUserDto(
    int Id,
    string Name,
    string Email,
    string Phone,
    bool IsPremium,
    DateTime CreatedAt
);
