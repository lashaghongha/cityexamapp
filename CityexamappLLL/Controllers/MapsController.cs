using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
public class MapsController : ControllerBase
{
    private static readonly string[] CityNames =
    [
        "",          // index 0 — unused
        "რუსთავი",
        "გორი",
        "თელავი",
        "ქუთაისი",
        "ფოთი",
        "საჩხერე",
        "ზუგდიდი",
        "თბილისი",
    ];

    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public MapsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // ── Admin: list all maps ─────────────────────────────
    [HttpGet("api/admin/maps")]
    public async Task<IActionResult> Get()
    {
        if (!await _db.Maps.AnyAsync())
        {
            var seed = new List<Map>();
            for (int cityId = 1; cityId <= 8; cityId++)
                for (int route = 1; route <= 8; route++)
                    seed.Add(new Map { City = CityNames[cityId], CityId = cityId, Route = route });

            _db.Maps.AddRange(seed);
            await _db.SaveChangesAsync();
        }
        return Ok(await _db.Maps.OrderBy(m => m.CityId).ThenBy(m => m.Route).ToListAsync());
    }

    // ── Admin: upload image for a map ────────────────────
    [HttpPost("api/admin/maps/{id}/upload")]
    public async Task<IActionResult> Upload(int id, IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "ფაილი ცარიელია" });

        var map = await _db.Maps.FindAsync(id);
        if (map == null) return NotFound();

        var webRoot = _env.WebRootPath
            ?? Path.Combine(_env.ContentRootPath, "wwwroot");

        var uploads = Path.Combine(webRoot, "maps");
        Directory.CreateDirectory(uploads);

        var ext      = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        map.ImageUrl  = $"/maps/{fileName}";
        map.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(map);
    }

    // ── Public: get map image for city+route (used by app) ──
    [HttpGet("api/maps/{cityId}/{routeId}")]
    public async Task<IActionResult> GetByRoute(int cityId, int routeId)
    {
        var map = await _db.Maps
            .FirstOrDefaultAsync(m => m.CityId == cityId && m.Route == routeId);

        if (map == null || map.ImageUrl == null)
            return Ok(new { imageUrl = (string?)null });

        return Ok(new { imageUrl = map.ImageUrl });
    }
}
