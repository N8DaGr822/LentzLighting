using System.ComponentModel.DataAnnotations;

namespace LentzLighting.Models;

public class Booking
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "";
    
    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email { get; set; } = "";
    
    [Required]
    [MaxLength(20)]
    public string Phone { get; set; } = "";
    
    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = "";
    
    [Required]
    [MaxLength(50)]
    public string Service { get; set; } = "";
    
    [Required]
    public DateTime PreferredDate { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string PreferredTime { get; set; } = "";
    
    [MaxLength(20)]
    public string Duration { get; set; } = "2-4";
    
    [MaxLength(500)]
    public string Notes { get; set; } = "";
    
    [MaxLength(20)]
    public string Status { get; set; } = "pending";
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    
    public string BookingReference { get; set; } = "";
    
    public int? TotalPrice { get; set; }
}
