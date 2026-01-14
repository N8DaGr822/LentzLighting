using Microsoft.AspNetCore.Identity;

namespace LentzLighting.Models;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
