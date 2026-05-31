namespace CityexamappLLL.Models;

public class Route
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public City City { get; set; } = null!;
    public int Number { get; set; }
    public string MapImageUrl { get; set; } = "";
    public bool IsLocked { get; set; } = true;

    public ICollection<Marker> Markers { get; set; } = new List<Marker>();
    public ICollection<UserRoute> UserRoutes { get; set; } = new List<UserRoute>();
}
