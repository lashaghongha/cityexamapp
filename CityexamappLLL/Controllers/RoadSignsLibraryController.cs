using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
public class RoadSignsLibraryController : ControllerBase
{
    private static readonly string[] CategoryNames =
        ["", "საფრთხილოებელი", "პრიორიტეტის", "ამკრძალავი", "მიმთითებელი",
         "საინფორმაციო - მაჩვენებელი", "საფრთხილოებელი 2", "სერვისის",
         "საინფორმაციო", "დამარეგულირებელი", "სასაზღვრო", "დამხმარე ფირფიტები"];

    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public RoadSignsLibraryController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    // Public: list all categories with sign counts
    [HttpGet("api/sign-categories")]
    public async Task<IActionResult> GetCategories()
    {
        if (!await _db.RoadSignCategories.AnyAsync())
        {
            var seed = Enumerable.Range(1, 11)
                .Select(i => new RoadSignCategory { Id = i, Name = CategoryNames[i] })
                .ToList();
            _db.RoadSignCategories.AddRange(seed);
            await _db.SaveChangesAsync();
        }

        var cats = await _db.RoadSignCategories.OrderBy(c => c.Id).ToListAsync();
        var counts = await _db.RoadSigns
            .GroupBy(s => s.CategoryId)
            .Select(g => new { CategoryId = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = cats.Select(c => new
        {
            c.Id,
            c.Name,
            Count = counts.FirstOrDefault(x => x.CategoryId == c.Id)?.Count ?? 0
        });

        return Ok(result);
    }

    // Public: list signs in a category
    [HttpGet("api/signs/{categoryId}")]
    public async Task<IActionResult> GetSigns(int categoryId)
    {
        var signs = await _db.RoadSigns
            .Where(s => s.CategoryId == categoryId)
            .OrderBy(s => s.Order)
            .ToListAsync();
        return Ok(signs);
    }

    // Admin: get all signs in a category
    [HttpGet("api/admin/road-signs")]
    public async Task<IActionResult> AdminGetSigns([FromQuery] int categoryId)
    {
        var signs = await _db.RoadSigns
            .Where(s => s.CategoryId == categoryId)
            .OrderBy(s => s.Order)
            .ToListAsync();
        return Ok(signs);
    }

    // Admin: create sign
    [HttpPost("api/admin/road-signs")]
    public async Task<IActionResult> Create([FromBody] RoadSign sign)
    {
        _db.RoadSigns.Add(sign);
        await _db.SaveChangesAsync();
        return Ok(sign);
    }

    // Admin: update sign
    [HttpPut("api/admin/road-signs/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] RoadSign sign)
    {
        var existing = await _db.RoadSigns.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Code = sign.Code;
        existing.Name = sign.Name;
        existing.Description = sign.Description;
        existing.Order = sign.Order;
        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    // Admin: delete sign
    [HttpDelete("api/admin/road-signs/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sign = await _db.RoadSigns.FindAsync(id);
        if (sign == null) return NotFound();
        _db.RoadSigns.Remove(sign);
        await _db.SaveChangesAsync();
        return Ok();
    }

    // Admin: upload sign image
    [HttpPost("api/admin/road-signs/{id}/upload")]
    public async Task<IActionResult> Upload(int id, IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "ფაილი ცარიელია" });

        var sign = await _db.RoadSigns.FindAsync(id);
        if (sign == null) return NotFound();

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploads = Path.Combine(webRoot, "sign-library");
        Directory.CreateDirectory(uploads);

        var ext = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
            await file.CopyToAsync(stream);

        sign.ImageUrl = $"/sign-library/{fileName}";
        await _db.SaveChangesAsync();
        return Ok(sign);
    }
}
