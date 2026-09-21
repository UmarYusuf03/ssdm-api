using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ssdm_api.Data;
using ssdm_api.DTOs;

namespace ssdm_api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController(AppDbContext db) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var notifs = await db.Notifications
            .Where(n => n.UserId == UserId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationDto(n.Id, n.Message, n.Type.ToString(), n.IsRead, n.CreatedAt))
            .ToListAsync();
        return Ok(notifs);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkRead(int id)
    {
        var notif = await db.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
        if (notif is null) return NotFound();
        notif.IsRead = true;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var notifs = db.Notifications.Where(n => n.UserId == UserId && !n.IsRead);
        await notifs.ForEachAsync(n => n.IsRead = true);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var notif = await db.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == UserId);
        if (notif is null) return NotFound();
        db.Notifications.Remove(notif);
        await db.SaveChangesAsync();
        return NoContent();
    }
}

