namespace ssdm_api.Models;

public class StudyBlock
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public string Topic { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public int Progress { get; set; } = 0;
    public bool IsCompleted { get; set; } = false;

    public Subject Subject { get; set; } = null!;
}

