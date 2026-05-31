namespace cityexamapp.DTOs.RoadSigns;

public record RoadSignDto(
    int Id,
    string Code,
    string Name,
    string Description,
    string ImageUrl,
    string SignType
);