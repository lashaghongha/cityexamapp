namespace CityexamappLLL.DTOs.Admin;

public record ChangeAdminPasswordDto(
    string CurrentPassword,
    string NewPassword
);

public record CreateTheoryDto(
    string Scenario,
    string QuestionText,
    string AnswerA,
    string AnswerB,
    string AnswerC,
    int CorrectAnswer,
    string Explanation
);

public record UpdateMapDto(int CityId, int RouteNumber);
