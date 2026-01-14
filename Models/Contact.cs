using System.ComponentModel.DataAnnotations;

namespace LentzLighting.Models;

public class Contact
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "";
    
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = "";
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(50)]
    public string? Service { get; set; }
    
    [Required]
    [MinLength(10)]
    [MaxLength(1000)]
    public string Message { get; set; } = "";
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    [MaxLength(20)]
    public string Status { get; set; } = "new";
}
