namespace CityexamappLLL.Models;

public class RoadSign
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string? ImageUrl { get; set; }
    public int Order { get; set; }
}
