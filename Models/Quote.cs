using System.ComponentModel.DataAnnotations;

namespace LentzLighting.Models;

public class Quote
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string PropertyType { get; set; } = "residential";
    
    [Required]
    [MaxLength(50)]
    public string Package { get; set; } = "basic";
    
    public bool Roofline { get; set; }
    public bool Trees { get; set; }
    public bool Bushes { get; set; }
    public bool Pathway { get; set; }
    public bool Animation { get; set; }
    
    public int SquareFootage { get; set; } = 2000;
    
    public int TotalPrice { get; set; }
    
    [MaxLength(100)]
    public string? CustomerName { get; set; }
    
    [EmailAddress]
    [MaxLength(100)]
    public string? Email { get; set; }
    
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(20)]
    public string Status { get; set; } = "pending";
    
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
