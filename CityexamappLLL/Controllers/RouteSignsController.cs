using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
public class RouteSignsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public RouteSignsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpGet("api/admin/route-signs")]
    public async Task<IActionResult> GetAdmin([FromQuery] int cityId, [FromQuery] int routeId)
    {
        var list = await _db.RouteSigns
            .Where(s => s.CityId == cityId && s.RouteId == routeId)
            .OrderBy(s => s.Order).ThenBy(s => s.Id)
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("api/route-signs/{cityId}/{routeId}")]
    public async Task<IActionResult> GetPublic(int cityId, int routeId)
    {
        var list = await _db.RouteSigns
            .Where(s => s.CityId == cityId && s.RouteId == routeId)
            .OrderBy(s => s.Order).ThenBy(s => s.Id)
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("api/admin/route-signs")]
    public async Task<IActionResult> Create(RouteSign body)
    {
        _db.RouteSigns.Add(body);
        await _db.SaveChangesAsync();
        return Ok(body);
    }

    [HttpPut("api/admin/route-signs/{id}")]
    public async Task<IActionResult> Update(int id, RouteSign body)
    {
        var s = await _db.RouteSigns.FindAsync(id);
        if (s == null) return NotFound();
        s.Name  = body.Name;
        s.Order = body.Order;
        await _db.SaveChangesAsync();
        return Ok(s);
    }

    [HttpPost("api/admin/route-signs/{id}/upload")]
    public async Task<IActionResult> Upload(int id, IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "ფაილი ცარიელია" });

        var sign = await _db.RouteSigns.FindAsync(id);
        if (sign == null) return NotFound();

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploads = Path.Combine(webRoot, "signs");
        Directory.CreateDirectory(uploads);

        var ext      = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
        {
            await file.CopyToAsync(stream);
        }

        sign.ImageUrl = $"/signs/{fileName}";
        await _db.SaveChangesAsync();
        return Ok(sign);
    }

    [HttpDelete("api/admin/route-signs/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var s = await _db.RouteSigns.FindAsync(id);
        if (s == null) return NotFound();
        _db.RouteSigns.Remove(s);
        await _db.SaveChangesAsync();
        return Ok();
    }
}
