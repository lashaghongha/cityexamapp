using CityexamappLLL.DTOs.Users;

namespace CityexamappLLL.DTOs.Auth;

public record AuthResponseDto(string Token, UserDto User);
