using LentzLighting.Models;
using Microsoft.AspNetCore.Identity;

namespace LentzLighting.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Create admin role if it doesn't exist
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        // Create admin user if it doesn't exist
        var adminEmail = "admin@lentzlighting.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = "admin",
                Email = adminEmail,
                EmailConfirmed = true,
                FullName = "Administrator",
                CreatedDate = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "Lentz2024!");
            
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        // Seed Map Locations if none exist
        if (!context.MapLocations.Any())
        {
            var mapLocations = new List<MapLocation>
            {
                // Premium Package Customers
                new MapLocation { Name = "Johnson Residence", Address = "123 Main St, Anytown, ST", CustomerName = "Sarah Johnson", ServiceType = "Premium Package", Status = "completed", Date = DateTime.UtcNow.AddDays(-5), Value = 750, Latitude = 40.7128, Longitude = -74.0060, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Smith Estate", Address = "456 Oak Ave, Anytown, ST", CustomerName = "John Smith", ServiceType = "Premium Package", Status = "completed", Date = DateTime.UtcNow.AddDays(-10), Value = 850, Latitude = 40.7160, Longitude = -74.0100, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Williams Mansion", Address = "789 Pine Rd, Anytown, ST", CustomerName = "Lisa Williams", ServiceType = "Premium Package", Status = "scheduled", Date = DateTime.UtcNow.AddDays(7), Value = 1200, Latitude = 40.7100, Longitude = -74.0040, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Brown Family Home", Address = "321 Elm St, Anytown, ST", CustomerName = "Mike Brown", ServiceType = "Premium Package", Status = "pending", Date = DateTime.UtcNow.AddDays(3), Value = 950, Latitude = 40.7140, Longitude = -74.0080, CreatedDate = DateTime.UtcNow },
                
                // Residential Customers
                new MapLocation { Name = "Davis Home", Address = "654 Maple Dr, Anytown, ST", CustomerName = "Emily Davis", ServiceType = "Residential", Status = "completed", Date = DateTime.UtcNow.AddDays(-15), Value = 350, Latitude = 40.7080, Longitude = -74.0020, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Miller Residence", Address = "987 Cedar Ln, Anytown, ST", CustomerName = "David Miller", ServiceType = "Residential", Status = "completed", Date = DateTime.UtcNow.AddDays(-8), Value = 420, Latitude = 40.7200, Longitude = -74.0120, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Wilson House", Address = "147 Birch St, Anytown, ST", CustomerName = "Jennifer Wilson", ServiceType = "Residential", Status = "scheduled", Date = DateTime.UtcNow.AddDays(5), Value = 380, Latitude = 40.7060, Longitude = -74.0000, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Taylor Family", Address = "258 Spruce Ave, Anytown, ST", CustomerName = "Robert Taylor", ServiceType = "Residential", Status = "pending", Date = DateTime.UtcNow.AddDays(10), Value = 450, Latitude = 40.7180, Longitude = -74.0140, CreatedDate = DateTime.UtcNow },
                
                // Custom Design Customers
                new MapLocation { Name = "Anderson Estate", Address = "369 Walnut Dr, Anytown, ST", CustomerName = "Patricia Anderson", ServiceType = "Custom Design", Status = "completed", Date = DateTime.UtcNow.AddDays(-20), Value = 1800, Latitude = 40.7220, Longitude = -74.0160, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Thomas Villa", Address = "741 Poplar Rd, Anytown, ST", CustomerName = "Christopher Thomas", ServiceType = "Custom Design", Status = "scheduled", Date = DateTime.UtcNow.AddDays(12), Value = 2200, Latitude = 40.7040, Longitude = -74.0180, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Jackson Mansion", Address = "852 Hickory Ln, Anytown, ST", CustomerName = "Amanda Jackson", ServiceType = "Custom Design", Status = "pending", Date = DateTime.UtcNow.AddDays(15), Value = 1900, Latitude = 40.7240, Longitude = -74.0200, CreatedDate = DateTime.UtcNow },
                
                // Basic Package Customers
                new MapLocation { Name = "White Home", Address = "963 Ash St, Anytown, ST", CustomerName = "Michael White", ServiceType = "Basic Package", Status = "completed", Date = DateTime.UtcNow.AddDays(-12), Value = 280, Latitude = 40.7020, Longitude = -74.0220, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Harris Residence", Address = "159 Willow Ave, Anytown, ST", CustomerName = "Linda Harris", ServiceType = "Basic Package", Status = "completed", Date = DateTime.UtcNow.AddDays(-18), Value = 320, Latitude = 40.7260, Longitude = -74.0240, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Clark House", Address = "357 Sycamore Dr, Anytown, ST", CustomerName = "James Clark", ServiceType = "Basic Package", Status = "scheduled", Date = DateTime.UtcNow.AddDays(8), Value = 290, Latitude = 40.7000, Longitude = -74.0260, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Lewis Family", Address = "468 Chestnut Rd, Anytown, ST", CustomerName = "Barbara Lewis", ServiceType = "Basic Package", Status = "pending", Date = DateTime.UtcNow.AddDays(20), Value = 310, Latitude = 40.7280, Longitude = -74.0280, CreatedDate = DateTime.UtcNow },
                
                // Commercial Customers
                new MapLocation { Name = "Downtown Office", Address = "123 Business Blvd, Anytown, ST", CustomerName = "ABC Corporation", ServiceType = "Commercial", Status = "completed", Date = DateTime.UtcNow.AddDays(-25), Value = 3500, Latitude = 40.7300, Longitude = -74.0300, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Shopping Center", Address = "456 Retail Plaza, Anytown, ST", CustomerName = "Mall Management", ServiceType = "Commercial", Status = "scheduled", Date = DateTime.UtcNow.AddDays(25), Value = 4200, Latitude = 40.6980, Longitude = -74.0320, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Hotel Complex", Address = "789 Hospitality Way, Anytown, ST", CustomerName = "Grand Hotel", ServiceType = "Commercial", Status = "pending", Date = DateTime.UtcNow.AddDays(30), Value = 3800, Latitude = 40.7320, Longitude = -74.0340, CreatedDate = DateTime.UtcNow },
                
                // Service Areas
                new MapLocation { Name = "North Service Area", Address = "North District, Anytown, ST", CustomerName = "Service Area", ServiceType = "Service Areas", Status = "completed", Date = DateTime.UtcNow.AddDays(-30), Value = 0, Latitude = 40.7340, Longitude = -74.0360, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "South Service Area", Address = "South District, Anytown, ST", CustomerName = "Service Area", ServiceType = "Service Areas", Status = "completed", Date = DateTime.UtcNow.AddDays(-30), Value = 0, Latitude = 40.6960, Longitude = -74.0380, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "East Service Area", Address = "East District, Anytown, ST", CustomerName = "Service Area", ServiceType = "Service Areas", Status = "completed", Date = DateTime.UtcNow.AddDays(-30), Value = 0, Latitude = 40.7360, Longitude = -74.0400, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "West Service Area", Address = "West District, Anytown, ST", CustomerName = "Service Area", ServiceType = "Service Areas", Status = "completed", Date = DateTime.UtcNow.AddDays(-30), Value = 0, Latitude = 40.6940, Longitude = -74.0420, CreatedDate = DateTime.UtcNow },
                
                // Upcoming Installations
                new MapLocation { Name = "Garcia Residence", Address = "147 New Home Dr, Anytown, ST", CustomerName = "Maria Garcia", ServiceType = "Premium Package", Status = "scheduled", Date = DateTime.UtcNow.AddDays(35), Value = 1100, Latitude = 40.7380, Longitude = -74.0440, CreatedDate = DateTime.UtcNow },
                new MapLocation { Name = "Rodriguez Estate", Address = "258 Luxury Ln, Anytown, ST", CustomerName = "Carlos Rodriguez", ServiceType = "Custom Design", Status = "pending", Date = DateTime.UtcNow.AddDays(40), Value = 2500, Latitude = 40.6920, Longitude = -74.0460, CreatedDate = DateTime.UtcNow }
            };

            context.MapLocations.AddRange(mapLocations);
            await context.SaveChangesAsync();
        }
    }
}
