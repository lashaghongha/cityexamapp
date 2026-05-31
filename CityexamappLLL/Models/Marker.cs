namespace CityexamappLLL.Models;

public class Marker
{
    public int Id { get; set; }
    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;
    public int Number { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public int SituationId { get; set; }
    public Situation Situation { get; set; } = null!;
}
