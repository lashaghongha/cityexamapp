namespace CityexamappLLL.Models;

public class SituationAnswer
{
    public int Id { get; set; }
    public int SituationId { get; set; }
    public Situation Situation { get; set; } = null!;
    public int OrderIndex { get; set; }
    public string Text { get; set; } = "";
}
