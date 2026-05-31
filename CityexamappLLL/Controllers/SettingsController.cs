using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
[Route("api/admin/settings")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SettingsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _db.Settings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new AppSettings
            {
                Price1Month = 9.99m,
                Price3Month = 7.99m,
                Price6Month = 5.99m,
                AdminPassword = "admin2024!"
            };
            _db.Settings.Add(settings);
            await _db.SaveChangesAsync();
        }
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> Update(AppSettings s)
    {
        var existing = await _db.Settings.FirstOrDefaultAsync();

        if (existing == null)
        {
            _db.Settings.Add(s);
        }
        else
        {
            existing.Price1Month = s.Price1Month;
            existing.Price3Month = s.Price3Month;
            existing.Price6Month = s.Price6Month;
            existing.AdminPassword = s.AdminPassword;
        }

        await _db.SaveChangesAsync();
        return Ok(s);
    }
}
