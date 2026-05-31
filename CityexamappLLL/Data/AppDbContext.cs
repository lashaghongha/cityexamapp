using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Models;

namespace CityexamappLLL.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<TheoryQuestion> TheoryQuestions => Set<TheoryQuestion>();
    public DbSet<Map> Maps => Set<Map>();
    public DbSet<AppSettings> Settings => Set<AppSettings>();
    public DbSet<RouteQuestion> RouteQuestions => Set<RouteQuestion>();
    public DbSet<RouteSign> RouteSigns => Set<RouteSign>();
    public DbSet<City> Cities => Set<City>();
    public DbSet<RoadSignCategory> RoadSignCategories => Set<RoadSignCategory>();
    public DbSet<RoadSign> RoadSigns => Set<RoadSign>();
}
