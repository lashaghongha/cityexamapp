using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CityexamappLLL.Data;
using CityexamappLLL.Models;

namespace CityexamappLLL.Controllers;

[ApiController]
[Route("api/admin/theory")]
public class TheoryController : ControllerBase
{
    private readonly AppDbContext _db;

    public TheoryController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.TheoryQuestions.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(TheoryQuestion q)
    {
        _db.TheoryQuestions.Add(q);
        await _db.SaveChangesAsync();
        return Ok(q);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TheoryQuestion q)
    {
        var existing = await _db.TheoryQuestions.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Scenario = q.Scenario;
        existing.Question = q.Question;
        existing.AnswerA = q.AnswerA;
        existing.AnswerB = q.AnswerB;
        existing.AnswerC = q.AnswerC;
        existing.CorrectAnswer = q.CorrectAnswer;
        existing.Explanation = q.Explanation;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var q = await _db.TheoryQuestions.FindAsync(id);
        if (q == null) return NotFound();

        _db.TheoryQuestions.Remove(q);
        await _db.SaveChangesAsync();
        return Ok();
    }
}
