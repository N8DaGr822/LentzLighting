using System.ComponentModel.DataAnnotations;

namespace LentzLighting.Models;

public class MapLocation
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = "";
    
    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = "";
    
    [Required]
    [MaxLength(100)]
    public string CustomerName { get; set; } = "";
    
    [Required]
    [MaxLength(50)]
    public string ServiceType { get; set; } = "";
    
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = "pending";
    
    [Required]
    public DateTime Date { get; set; }
    
    public int Value { get; set; }
    
    [Required]
    public double Latitude { get; set; }
    
    [Required]
    public double Longitude { get; set; }
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
