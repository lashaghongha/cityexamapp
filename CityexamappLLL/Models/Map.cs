namespace CityexamappLLL.Models;

public class Map
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public string City { get; set; } = "";
    public int Route { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
