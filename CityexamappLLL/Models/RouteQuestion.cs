namespace CityexamappLLL.Models;

public class RouteQuestion
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public int RouteId { get; set; }
    public string Scenario { get; set; } = "";
    public string Question { get; set; } = "";
    public string AnswerA { get; set; } = "";
    public string AnswerB { get; set; } = "";
    public string AnswerC { get; set; } = "";
    public string CorrectAnswer { get; set; } = "A";
    public string Explanation { get; set; } = "";
    public string? LocationPhotoUrl { get; set; }
    public double MarkerX { get; set; } = 50;
    public double MarkerY { get; set; } = 50;
}
