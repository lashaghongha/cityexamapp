namespace cityexamapp.DTOs.Routes;

public record MarkerDto(
    int Id,
    int Number,
    double X,
    double Y,
    int SituationId,
    string SignType
);