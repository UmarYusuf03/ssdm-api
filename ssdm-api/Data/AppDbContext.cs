using Microsoft.EntityFrameworkCore;
using ssdm_api.Models;

namespace ssdm_api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<StudyBlock> StudyBlocks => Set<StudyBlock>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Subject>(e =>
        {
            e.HasOne(s => s.User)
             .WithMany(u => u.Subjects)
             .HasForeignKey(s => s.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Assignment>(e =>
        {
            e.Property(a => a.Priority).HasConversion<string>();
            e.Property(a => a.Status).HasConversion<string>();
            e.HasOne(a => a.Subject)
             .WithMany(s => s.Assignments)
             .HasForeignKey(a => a.SubjectId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudyBlock>(e =>
        {
            e.HasOne(sb => sb.Subject)
             .WithMany(s => s.StudyBlocks)
             .HasForeignKey(sb => sb.SubjectId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(e =>
        {
            e.Property(n => n.Type).HasConversion<string>();
            e.HasOne(n => n.User)
             .WithMany(u => u.Notifications)
             .HasForeignKey(n => n.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

