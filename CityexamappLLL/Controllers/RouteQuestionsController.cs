using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
public class RouteQuestionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public RouteQuestionsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    [HttpGet("api/admin/route-questions")]
    public async Task<IActionResult> GetAdmin([FromQuery] int cityId, [FromQuery] int routeId)
    {
        var list = await _db.RouteQuestions
            .Where(q => q.CityId == cityId && q.RouteId == routeId)
            .OrderBy(q => q.Id)
            .ToListAsync();
        return Ok(list);
    }

    [HttpGet("api/route-questions/{cityId}/{routeId}")]
    public async Task<IActionResult> GetPublic(int cityId, int routeId)
    {
        var list = await _db.RouteQuestions
            .Where(q => q.CityId == cityId && q.RouteId == routeId)
            .OrderBy(q => q.Id)
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("api/admin/route-questions")]
    public async Task<IActionResult> Create(RouteQuestion body)
    {
        _db.RouteQuestions.Add(body);
        await _db.SaveChangesAsync();
        return Ok(body);
    }

    [HttpPut("api/admin/route-questions/{id}")]
    public async Task<IActionResult> Update(int id, RouteQuestion body)
    {
        var q = await _db.RouteQuestions.FindAsync(id);
        if (q == null) return NotFound();
        q.Scenario      = body.Scenario;
        q.Question      = body.Question;
        q.AnswerA       = body.AnswerA;
        q.AnswerB       = body.AnswerB;
        q.AnswerC       = body.AnswerC;
        q.CorrectAnswer = body.CorrectAnswer;
        q.Explanation   = body.Explanation;
        q.MarkerX       = body.MarkerX;
        q.MarkerY       = body.MarkerY;
        await _db.SaveChangesAsync();
        return Ok(q);
    }

    [HttpDelete("api/admin/route-questions/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var q = await _db.RouteQuestions.FindAsync(id);
        if (q == null) return NotFound();
        _db.RouteQuestions.Remove(q);
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("api/admin/route-questions/{id}/upload-photo")]
    public async Task<IActionResult> UploadPhoto(int id, IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "ფაილი ცარიელია" });

        var q = await _db.RouteQuestions.FindAsync(id);
        if (q == null) return NotFound();

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploads = Path.Combine(webRoot, "location-photos");
        Directory.CreateDirectory(uploads);

        var ext      = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{ext}";
        var fullPath = Path.Combine(uploads, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
            await file.CopyToAsync(stream);

        q.LocationPhotoUrl = $"/location-photos/{fileName}";
        await _db.SaveChangesAsync();
        return Ok(q);
    }
}
