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
public class SubjectsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subjects = await db.Subjects
            .Where(s => s.UserId == UserId)
            .Include(s => s.Assignments)
            .Select(s => new SubjectDto(
                s.Id, s.Name, s.Code, s.Lecturer, s.Color, s.Progress,
                s.Assignments.Count,
                s.Assignments.Count(a => a.Status == AssignmentStatus.Done)))
            .ToListAsync();
        return Ok(subjects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var s = await db.Subjects.Include(s => s.Assignments)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == UserId);
        if (s is null) return NotFound();
        return Ok(new SubjectDto(s.Id, s.Name, s.Code, s.Lecturer, s.Color, s.Progress,
            s.Assignments.Count, s.Assignments.Count(a => a.Status == AssignmentStatus.Done)));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateSubjectDto dto)
    {
        var subject = new Subject
        {
            UserId = UserId,
            Name = dto.Name,
            Code = dto.Code,
            Lecturer = dto.Lecturer,
            Color = dto.Color
        };
        db.Subjects.Add(subject);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = subject.Id },
            new SubjectDto(subject.Id, subject.Name, subject.Code, subject.Lecturer, subject.Color, subject.Progress, 0, 0));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateSubjectDto dto)
    {
        var subject = await db.Subjects.FirstOrDefaultAsync(s => s.Id == id && s.UserId == UserId);
        if (subject is null) return NotFound();
        subject.Name = dto.Name;
        subject.Code = dto.Code;
        subject.Lecturer = dto.Lecturer;
        subject.Color = dto.Color;
        subject.Progress = dto.Progress;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var subject = await db.Subjects.FirstOrDefaultAsync(s => s.Id == id && s.UserId == UserId);
        if (subject is null) return NotFound();
        db.Subjects.Remove(subject);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

