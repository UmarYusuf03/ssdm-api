namespace ssdm_api.Models;

public class Subject
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Lecturer { get; set; } = string.Empty;
    public string Color { get; set; } = "#4F46E5";
    public int Progress { get; set; } = 0; // 0–100
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public ICollection<Assignment> Assignments { get; set; } = [];
    public ICollection<StudyBlock> StudyBlocks { get; set; } = [];
}

