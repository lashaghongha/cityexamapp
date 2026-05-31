namespace cityexamapp.DTOs.Situations;

public record SituationDto(
    int Id,
    string Title,
    string PhotoUrl,
    string SignType,
    int CorrectAnswer,
    List<AnswerDto> Answers
);