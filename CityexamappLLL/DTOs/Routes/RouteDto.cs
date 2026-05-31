namespace cityexamapp.DTOs.Routes;

public record RouteDto(
    int Id,
    int CityId,
    int Number,
    string MapImageUrl,
    bool IsLocked,
    bool IsCompleted
);