namespace ssdm_api.DTOs;

// Auth DTOs
public record RegisterDto(string Name, string Email, string Password);
public record LoginDto(string Email, string Password);
public record AuthResponseDto(string Token, UserDto User);

// User DTO
public record UserDto(int Id, string Name, string Email, string AvatarUrl);

// Subject DTOs
public record SubjectDto(int Id, string Name, string Code, string Lecturer, string Color, int Progress, int AssignmentsCount, int CompletedCount);
public record CreateSubjectDto(string Name, string Code, string Lecturer, string Color);
public record UpdateSubjectDto(string Name, string Code, string Lecturer, string Color, int Progress);

// Assignment DTOs
public record AssignmentDto(
    int Id, int SubjectId, string SubjectName, string SubjectColor,
    string Title, string Description, DateTime DueDate,
    string Priority, string Status, int Progress);
public record CreateAssignmentDto(int SubjectId, string Title, string Description, DateTime DueDate, string Priority, string Status);
public record UpdateAssignmentDto(string Title, string Description, DateTime DueDate, string Priority, string Status, int Progress);

// StudyBlock DTOs
public record StudyBlockDto(int Id, int SubjectId, string SubjectName, string SubjectColor, string Topic, DateTime StartTime, DateTime EndTime, int Progress, bool IsCompleted);
public record CreateStudyBlockDto(int SubjectId, string Topic, DateTime StartTime, DateTime EndTime);
public record UpdateStudyBlockDto(string Topic, DateTime StartTime, DateTime EndTime, int Progress, bool IsCompleted);

// Notification DTOs
public record NotificationDto(int Id, string Message, string Type, bool IsRead, DateTime CreatedAt);

// Dashboard DTO
public record DashboardStatsDto(
    int TotalSubjects,
    int PendingAssignments,
    int UpcomingDeadlines,
    int CompletionRate,
    IEnumerable<AssignmentDto> UpcomingAssignments,
    IEnumerable<StudyBlockDto> TodayStudyBlocks
);

