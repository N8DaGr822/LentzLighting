using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LentzLighting.Models;


namespace LentzLighting.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Business entities
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Quote> Quotes { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<MapLocation> MapLocations { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Custom configurations will be added here as needed
    }
}
