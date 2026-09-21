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
public class AssignmentsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private static AssignmentDto Map(Assignment a) => new(
        a.Id, a.SubjectId, a.Subject.Name, a.Subject.Color,
        a.Title, a.Description, a.DueDate,
        a.Priority.ToString(), a.Status.ToString(), a.Progress);

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? subjectId, [FromQuery] string? priority, [FromQuery] string? status)
    {
        var query = db.Assignments
            .Include(a => a.Subject)
            .Where(a => a.Subject.UserId == UserId);

        if (subjectId.HasValue) query = query.Where(a => a.SubjectId == subjectId.Value);
        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<Priority>(priority, out var p))
            query = query.Where(a => a.Priority == p);
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<AssignmentStatus>(status, out var s))
            query = query.Where(a => a.Status == s);

        var results = await query.OrderBy(a => a.DueDate).Select(a => Map(a)).ToListAsync();
        return Ok(results);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var a = await db.Assignments.Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == id && a.Subject.UserId == UserId);
        if (a is null) return NotFound();
        return Ok(Map(a));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssignmentDto dto)
    {
        // Validate subject belongs to user
        var subject = await db.Subjects.FirstOrDefaultAsync(s => s.Id == dto.SubjectId && s.UserId == UserId);
        if (subject is null) return BadRequest(new { message = "Subject not found." });

        var assignment = new Assignment
        {
            SubjectId = dto.SubjectId,
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            Priority = Enum.Parse<Priority>(dto.Priority),
            Status = Enum.Parse<AssignmentStatus>(dto.Status)
        };
        db.Assignments.Add(assignment);
        await db.SaveChangesAsync();
        await db.Entry(assignment).Reference(a => a.Subject).LoadAsync();
        return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, Map(assignment));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateAssignmentDto dto)
    {
        var a = await db.Assignments.Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == id && a.Subject.UserId == UserId);
        if (a is null) return NotFound();
        a.Title = dto.Title;
        a.Description = dto.Description;
        a.DueDate = dto.DueDate;
        a.Priority = Enum.Parse<Priority>(dto.Priority);
        a.Status = Enum.Parse<AssignmentStatus>(dto.Status);
        a.Progress = dto.Progress;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var a = await db.Assignments.Include(a => a.Subject)
            .FirstOrDefaultAsync(a => a.Id == id && a.Subject.UserId == UserId);
        if (a is null) return NotFound();
        db.Assignments.Remove(a);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

