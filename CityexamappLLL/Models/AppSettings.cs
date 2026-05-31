namespace CityexamappLLL.Models;

public class AppSettings
{
    public int Id { get; set; }
    public decimal Price1Month { get; set; }
    public decimal Price3Month { get; set; }
    public decimal Price6Month { get; set; }
    public string AdminPassword { get; set; } = "admin2024!";
}
