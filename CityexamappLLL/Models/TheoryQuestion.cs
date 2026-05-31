namespace CityexamappLLL.Models;

public class TheoryQuestion
{
    public int Id { get; set; }
    public string Scenario { get; set; } = "";
    public string Question { get; set; } = "";
    public string AnswerA { get; set; } = "";
    public string AnswerB { get; set; } = "";
    public string AnswerC { get; set; } = "";
    public string CorrectAnswer { get; set; } = "";
    public string Explanation { get; set; } = "";
}
