namespace CityexamappLLL.Models;

public class RouteSign
{
    public int Id { get; set; }
    public int CityId { get; set; }
    public int RouteId { get; set; }
    public string Name { get; set; } = "";
    public string? ImageUrl { get; set; }
    public int Order { get; set; }
}
