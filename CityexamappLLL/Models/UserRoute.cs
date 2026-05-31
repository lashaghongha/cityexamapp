namespace CityexamappLLL.Models;

public class UserRoute
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int RouteId { get; set; }
    public Route Route { get; set; } = null!;
    public bool IsCompleted { get; set; } = false;
    public DateTime CompletedAt { get; set; }
}
