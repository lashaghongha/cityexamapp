namespace CityexamappLLL.Models;

public class Situation
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public string SignType { get; set; } = "";
    public int CorrectAnswer { get; set; }

    public ICollection<SituationAnswer> Answers { get; set; } = new List<SituationAnswer>();
    public ICollection<Marker> Markers { get; set; } = new List<Marker>();
}
