namespace CityexamappLLL.Models;

public class AdminSettings
{
    public int Id { get; set; }
    public decimal Price1Month { get; set; } = 9.99m;
    public decimal Price3Month { get; set; } = 7.99m;
    public decimal Price6Month { get; set; } = 5.99m;
    public string AdminPasswordHash { get; set; } = "";
}
