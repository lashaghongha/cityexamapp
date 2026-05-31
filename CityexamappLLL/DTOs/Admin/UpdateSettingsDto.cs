namespace CityexamappLLL.DTOs.Admin;

public record UpdateSettingsDto(
    decimal Price1Month,
    decimal Price3Month,
    decimal Price6Month
);
