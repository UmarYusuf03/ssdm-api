namespace ssdm_api.Models;

public enum Priority { Low, Medium, High }
public enum AssignmentStatus { NotStarted, InProgress, Done }

public class Assignment
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public Priority Priority { get; set; } = Priority.Medium;
    public AssignmentStatus Status { get; set; } = AssignmentStatus.NotStarted;
    public int Progress { get; set; } = 0; // 0–100
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Subject Subject { get; set; } = null!;
}

