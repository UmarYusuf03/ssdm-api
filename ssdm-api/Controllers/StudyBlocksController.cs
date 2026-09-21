using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ssdm_api.Data;
using ssdm_api.DTOs;
using ssdm_api.Models;

namespace ssdm_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudyBlocksController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private static StudyBlockDto Map(StudyBlock sb) => new(
        sb.Id, sb.SubjectId, sb.Subject.Name, sb.Subject.Color,
        sb.Topic, sb.StartTime, sb.EndTime, sb.Progress, sb.IsCompleted);

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? date)
    {
        var query = db.StudyBlocks
            .Include(sb => sb.Subject)
            .Where(sb => sb.Subject.UserId == UserId);

        if (date.HasValue)
        {
            var d = date.Value.Date;
            query = query.Where(sb => sb.StartTime.Date == d);
        }

        var results = await query.OrderBy(sb => sb.StartTime).Select(sb => Map(sb)).ToListAsync();
        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateStudyBlockDto dto)
    {
        var subject = await db.Subjects.FirstOrDefaultAsync(s => s.Id == dto.SubjectId && s.UserId == UserId);
        if (subject is null) return BadRequest(new { message = "Subject not found." });

        var block = new StudyBlock
        {
            SubjectId = dto.SubjectId,
            Topic = dto.Topic,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };
        db.StudyBlocks.Add(block);
        await db.SaveChangesAsync();
        await db.Entry(block).Reference(b => b.Subject).LoadAsync();
        return CreatedAtAction(null, Map(block));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateStudyBlockDto dto)
    {
        var block = await db.StudyBlocks.Include(b => b.Subject)
            .FirstOrDefaultAsync(b => b.Id == id && b.Subject.UserId == UserId);
        if (block is null) return NotFound();
        block.Topic = dto.Topic;
        block.StartTime = dto.StartTime;
        block.EndTime = dto.EndTime;
        block.Progress = dto.Progress;
        block.IsCompleted = dto.IsCompleted;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var block = await db.StudyBlocks.Include(b => b.Subject)
            .FirstOrDefaultAsync(b => b.Id == id && b.Subject.UserId == UserId);
        if (block is null) return NotFound();
        db.StudyBlocks.Remove(block);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

