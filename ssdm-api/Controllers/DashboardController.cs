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
public class DashboardController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var nextWeek = today.AddDays(7);

        var subjects = await db.Subjects.Where(s => s.UserId == UserId).Include(s => s.Assignments).ToListAsync();
        var allAssignments = subjects.SelectMany(s => s.Assignments).ToList();

        var totalSubjects = subjects.Count;
        var pending = allAssignments.Count(a => a.Status != AssignmentStatus.Done);
        var upcoming = allAssignments.Count(a => a.DueDate >= now && a.DueDate <= nextWeek && a.Status != AssignmentStatus.Done);
        var total = allAssignments.Count;
        var completed = allAssignments.Count(a => a.Status == AssignmentStatus.Done);
        var completionRate = total > 0 ? (int)Math.Round((double)completed / total * 100) : 0;

        var upcomingAssignments = allAssignments
            .Where(a => a.Status != AssignmentStatus.Done)
            .OrderBy(a => a.DueDate)
            .Take(5)
            .Select(a => new AssignmentDto(
                a.Id, a.SubjectId,
                subjects.First(s => s.Id == a.SubjectId).Name,
                subjects.First(s => s.Id == a.SubjectId).Color,
                a.Title, a.Description, a.DueDate,
                a.Priority.ToString(), a.Status.ToString(), a.Progress))
            .ToList();

        var todayBlocks = await db.StudyBlocks
            .Include(sb => sb.Subject)
            .Where(sb => sb.Subject.UserId == UserId && sb.StartTime.Date == today)
            .OrderBy(sb => sb.StartTime)
            .Select(sb => new StudyBlockDto(sb.Id, sb.SubjectId, sb.Subject.Name, sb.Subject.Color, sb.Topic, sb.StartTime, sb.EndTime, sb.Progress, sb.IsCompleted))
            .ToListAsync();

        return Ok(new DashboardStatsDto(totalSubjects, pending, upcoming, completionRate, upcomingAssignments, todayBlocks));
    }
}

