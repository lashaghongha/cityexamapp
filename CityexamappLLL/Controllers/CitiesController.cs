using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
public class CitiesController : ControllerBase
{
    private static readonly string[] CityNames =
        ["", "რუსთავი", "გორი", "თელავი", "ქუთაისი", "ფოთი", "საჩხერე", "ზუგდიდი", "თბილისი"];

    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public CitiesController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // Public + Admin: list all cities (seeds on first call)
    [HttpGet("api/cities")]
    public async Task<IActionResult> GetAll()
    {
        if (!await _db.Cities.AnyAsync())
        {
            var seed = Enumerable.Range(1, 8)
                .Select(i => new City { Id = i, Name = CityNames[i] })
                .ToList();
            _db.Cities.AddRange(seed);
            await _db.SaveChangesAsync();
        }
        return Ok(await _db.Cities.OrderBy(c => c.Id).ToListAsync());
    }

    // Admin: upload city image
    [HttpPost("api/admin/cities/{id}/upload")]
    public async Task<IActionResult> Upload(int id, IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "ფაილი ცარიელია" });

        var city = await _db.Cities.FindAsync(id);
        if (city == null) return NotFound();

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploads = Path.Combine(webRoot, "city-photos");
        Directory.CreateDirectory(uploads);

        var ext      = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        city.ImageUrl = $"/city-photos/{fileName}";
        await _db.SaveChangesAsync();
        return Ok(city);
    }
}
