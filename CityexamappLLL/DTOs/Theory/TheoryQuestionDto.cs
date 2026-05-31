namespace cityexamapp.DTOs.Theory;

public record TheoryQuestionDto(
    int Id,
    string Scenario,
    string QuestionText,
    string AnswerA,
    string AnswerB,
    string AnswerC,
    int CorrectAnswer,
    string Explanation
);