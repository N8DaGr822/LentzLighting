# Lentz Lighting - Implementation Plan

**Project:** Lentz Lighting Application Improvements  
**Start Date:** January 2025  
**Approach:** Phased implementation, one task at a time

---

## 📋 Plan Overview

This plan addresses the critical issues identified in the evaluation, starting with security and progressing through data persistence, email functionality, and testing.

**Total Phases:** 4  
**Estimated Timeline:** 6-8 weeks  
**Priority Order:** Security → Data → Email → Testing

---

## 🎯 Phase 1: Security & Authentication (Weeks 1-2)

### **Goal:** Replace insecure localStorage authentication with proper ASP.NET Core Identity

### Task 1.1: Review Current Authentication System
- [ ] Review `AdminLogin.razor` and `Admin.razor`
- [ ] Document current authentication flow
- [ ] Identify all places using localStorage for auth
- [ ] List all admin-protected routes

**Files to Review:**
- `Components/Pages/AdminLogin.razor`
- `Components/Pages/Admin.razor`
- `Components/Pages/AdminMap.razor`
- `wwwroot/app.js` (if auth-related JS exists)

**Estimated Time:** 30 minutes

---

### Task 1.2: Install Required NuGet Packages
- [ ] Install `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- [ ] Install `Microsoft.EntityFrameworkCore.SqlServer` (or PostgreSQL)
- [ ] Install `Microsoft.EntityFrameworkCore.Tools` (for migrations)
- [ ] Update `LentzLighting.csproj`

**Commands:**
```bash
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

**Estimated Time:** 15 minutes

---

### Task 1.3: Create Identity Models
- [ ] Create `Models/ApplicationUser.cs` (extends IdentityUser)
- [ ] Create `Models/ApplicationRole.cs` (extends IdentityRole) - optional
- [ ] Add custom properties if needed (e.g., FullName, CreatedDate)

**File Structure:**
```
Models/
  ├── ApplicationUser.cs
  └── ApplicationRole.cs (optional)
```

**Estimated Time:** 30 minutes

---

### Task 1.4: Create ApplicationDbContext
- [ ] Create `Data/ApplicationDbContext.cs`
- [ ] Inherit from `IdentityDbContext<ApplicationUser>`
- [ ] Add DbSets for future entities (Bookings, Quotes, Contacts, Locations)
- [ ] Configure relationships

**File Structure:**
```
Data/
  └── ApplicationDbContext.cs
```

**Estimated Time:** 45 minutes

---

### Task 1.5: Configure Identity in Program.cs
- [ ] Add Identity services to DI container
- [ ] Configure Identity options (password requirements, lockout, etc.)
- [ ] Add Entity Framework with connection string
- [ ] Configure authentication cookies (secure, httpOnly, sameSite)

**Changes in `Program.cs`:**
- Add `AddIdentity` or `AddDefaultIdentity`
- Add `AddEntityFrameworkStores<ApplicationDbContext>`
- Configure `CookieAuthenticationDefaults`
- Add connection string to `appsettings.json`

**Estimated Time:** 1 hour

---

### Task 1.6: Create Initial Migration
- [ ] Run `dotnet ef migrations add InitialIdentityMigration`
- [ ] Review migration files
- [ ] Run `dotnet ef database update`
- [ ] Verify database creation

**Commands:**
```bash
dotnet ef migrations add InitialIdentityMigration
dotnet ef database update
```

**Estimated Time:** 30 minutes

---

### Task 1.7: Create Seed Data for Admin User
- [ ] Create `Data/DbInitializer.cs` or seed method
- [ ] Hash password using `PasswordHasher`
- [ ] Create admin user on first run
- [ ] Add seeding logic to `Program.cs`

**File Structure:**
```
Data/
  └── DbInitializer.cs
```

**Estimated Time:** 1 hour

---

### Task 1.8: Update AdminLogin.razor
- [ ] Remove localStorage authentication
- [ ] Use `SignInManager<ApplicationUser>`
- [ ] Implement proper login with password verification
- [ ] Add error handling for invalid credentials
- [ ] Add account lockout handling
- [ ] Remove hardcoded credentials

**Changes:**
- Inject `SignInManager<ApplicationUser>`
- Inject `UserManager<ApplicationUser>`
- Replace localStorage checks with `SignInAsync`
- Add proper validation

**Estimated Time:** 2 hours

---

### Task 1.9: Update Admin.razor
- [ ] Remove localStorage authentication checks
- [ ] Add `[Authorize]` attribute
- Use `User.Identity.IsAuthenticated`
- [ ] Remove `CheckAuthentication()` method
- [ ] Update logout to use `SignOutAsync`

**Changes:**
- Add `@using Microsoft.AspNetCore.Authorization`
- Add `@attribute [Authorize]`
- Inject `SignInManager<ApplicationUser>`
- Replace auth checks with `User.Identity.IsAuthenticated`

**Estimated Time:** 1.5 hours

---

### Task 1.10: Update AdminMap.razor
- [ ] Remove localStorage authentication checks
- [ ] Add `[Authorize]` attribute
- [ ] Use `User.Identity.IsAuthenticated`
- [ ] Remove `adminFromAuthenticatedPage` flag logic

**Estimated Time:** 1 hour

---

### Task 1.11: Update NavMenu.razor
- [ ] Change admin link back to `/admin` (not `/admin-login`)
- [ ] Add conditional display based on authentication
- [ ] Show "Admin" link only if authenticated

**Estimated Time:** 30 minutes

---

### Task 1.12: Add Authorization Policies (Optional but Recommended)
- [ ] Create admin-only policy
- [ ] Configure in `Program.cs`
- [ ] Apply `[Authorize(Policy = "AdminOnly")]` to admin pages

**Estimated Time:** 30 minutes

---

### Task 1.13: Test Authentication Flow
- [ ] Test login with correct credentials
- [ ] Test login with incorrect credentials
- [ ] Test logout functionality
- [ ] Test session persistence
- [ ] Test unauthorized access attempts
- [ ] Test account lockout (if configured)

**Estimated Time:** 1 hour

---

### Task 1.14: Remove Debug/Test Code
- [ ] Remove "Test Auth" button from Admin.razor
- [ ] Remove debug console.log statements
- [ ] Clean up commented code
- [ ] Remove unused methods

**Estimated Time:** 30 minutes

---

**Phase 1 Total Estimated Time:** 12-14 hours (1.5-2 weeks)

---

## 🗄️ Phase 2: Database & Data Persistence (Weeks 2-3)

### **Goal:** Implement database to persist bookings, quotes, contacts, and customer locations

### Task 2.1: Design Database Schema
- [ ] Create ER diagram (optional but helpful)
- [ ] Define entities:
  - Bookings
  - Id, Name, Email, Phone, Address
  - ServiceType, PreferredDate, PreferredTime
  - Status, Notes, CreatedDate
  - Quotes
  - Contacts
  - MapLocations (customers)
- [ ] Define relationships
- [ ] Plan indexes

**Estimated Time:** 1 hour

---

### Task 2.2: Create Entity Models
- [ ] Create `Models/Booking.cs`
- [ ] Create `Models/Quote.cs`
- [ ] Create `Models/Contact.cs`
- [ ] Create `Models/MapLocation.cs`
- [ ] Add data annotations (Required, MaxLength, etc.)
- [ ] Add navigation properties if needed

**File Structure:**
```
Models/
  ├── Booking.cs
  ├── Quote.cs
  ├── Contact.cs
  └── MapLocation.cs
```

**Estimated Time:** 2 hours

---

### Task 2.3: Update ApplicationDbContext
- [ ] Add DbSet<Booking>
- [ ] Add DbSet<Quote>
- [ ] Add DbSet<Contact>
- [ ] Add DbSet<MapLocation>
- [ ] Configure entity relationships
- [ ] Add OnModelCreating configurations

**Estimated Time:** 1.5 hours

---

### Task 2.4: Create Migration for Entities
- [ ] Run `dotnet ef migrations add AddBusinessEntities`
- [ ] Review migration
- [ ] Update database
- [ ] Verify tables created

**Commands:**
```bash
dotnet ef migrations add AddBusinessEntities
dotnet ef database update
```

**Estimated Time:** 30 minutes

---

### Task 2.5: Create Repository Pattern (Optional but Recommended)
- [ ] Create `IRepository<T>` interface
- [ ] Create `Repository<T>` base class
- [ ] Create specific repositories:
  - `IBookingRepository` / `BookingRepository`
  - `IQuoteRepository` / `QuoteRepository`
  - `IContactRepository` / `ContactRepository`
  - `IMapLocationRepository` / `MapLocationRepository`
- [ ] Register in DI container

**File Structure:**
```
Repositories/
  ├── IRepository.cs
  ├── Repository.cs
  ├── IBookingRepository.cs
  ├── BookingRepository.cs
  └── ... (other repositories)
```

**Estimated Time:** 3 hours

---

### Task 2.6: Update Booking.razor to Save Data
- [ ] Inject repository or DbContext
- [ ] Update `HandleBooking()` to save to database
- [ ] Add error handling
- [ ] Return booking ID in success message
- [ ] Remove simulation delay

**Changes:**
- Replace `Task.Delay(2000)` with actual save
- Add try-catch for errors
- Show error message if save fails

**Estimated Time:** 1.5 hours

---

### Task 2.7: Update Contact.razor to Save Data
- [ ] Inject repository or DbContext
- [ ] Update `HandleSubmit()` to save to database
- [ ] Add error handling
- [ ] Remove simulation delay

**Estimated Time:** 1 hour

---

### Task 2.8: Update QuoteCalculator to Save Quotes
- [ ] Create Quote entity from calculator data
- [ ] Save quote when "Request Detailed Quote" is clicked
- [ ] Link quote to contact if user is logged in (future)

**Estimated Time:** 1 hour

---

### Task 2.9: Update Admin Dashboard to Load Real Data
- [ ] Update Overview tab to load from database
- [ ] Calculate real statistics:
  - Total bookings count
  - Total revenue (sum of booking values)
  - Pending quotes count
  - Average rating (if added)
- [ ] Update Bookings tab to show real bookings
- [ ] Update Quotes tab to show real quotes

**Estimated Time:** 3 hours

---

### Task 2.10: Update AdminMap to Load Real Locations
- [ ] Replace hardcoded locations with database query
- [ ] Load locations from `MapLocation` table
- [ ] Update map initialization to use real data
- [ ] Keep sample data as seed data option

**Estimated Time:** 2 hours

---

### Task 2.11: Create Seed Data
- [ ] Add sample bookings to seed data
- [ ] Add sample quotes
- [ ] Add sample contacts
- [ ] Add sample map locations (the 24 existing ones)
- [ ] Update DbInitializer to seed all data

**Estimated Time:** 2 hours

---

### Task 2.12: Add CRUD Operations for Admin
- [ ] Create admin pages for managing bookings:
  - List all bookings
  - View booking details
  - Edit booking status
  - Delete bookings (soft delete recommended)
- [ ] Create admin pages for managing quotes
- [ ] Create admin pages for managing contacts
- [ ] Create admin pages for managing map locations

**File Structure:**
```
Components/Pages/Admin/
  ├── Bookings/
  │   ├── Index.razor
  │   ├── Details.razor
  │   └── Edit.razor
  └── ... (similar for other entities)
```

**Estimated Time:** 8 hours

---

### Task 2.13: Add Data Validation
- [ ] Add server-side validation
- [ ] Add custom validation attributes if needed
- [ ] Validate email formats
- [ ] Validate phone numbers
- [ ] Validate dates (no past dates for bookings)

**Estimated Time:** 2 hours

---

### Task 2.14: Test Data Persistence
- [ ] Test booking creation
- [ ] Test contact form submission
- [ ] Test quote creation
- [ ] Test admin viewing data
- [ ] Test CRUD operations
- [ ] Test data validation

**Estimated Time:** 2 hours

---

**Phase 2 Total Estimated Time:** 28-30 hours (2-3 weeks)

---

## 📧 Phase 3: Email Functionality (Week 4)

### **Goal:** Implement email notifications for bookings, quotes, and contact forms

### Task 3.1: Choose Email Service Provider
- [ ] Research options:
  - SendGrid (recommended - free tier available)
  - Mailgun
  - SMTP (Gmail, Outlook, etc.)
- [ ] Create account if needed
- [ ] Get API key or SMTP credentials

**Recommended:** SendGrid (free tier: 100 emails/day)

**Estimated Time:** 30 minutes

---

### Task 3.2: Install Email Package
- [ ] Install `SendGrid` NuGet package OR
- [ ] Use `System.Net.Mail` for SMTP
- [ ] Configure in `appsettings.json`

**Commands:**
```bash
dotnet add package SendGrid
```

**Estimated Time:** 15 minutes

---

### Task 3.3: Create Email Service Interface
- [ ] Create `Services/IEmailService.cs`
- [ ] Define methods:
  - `SendBookingConfirmationAsync(Booking booking)`
  - `SendQuoteRequestAsync(Quote quote)`
  - `SendContactFormAsync(Contact contact)`
  - `SendAdminNotificationAsync(string subject, string body)`

**File Structure:**
```
Services/
  ├── IEmailService.cs
  └── EmailService.cs
```

**Estimated Time:** 30 minutes

---

### Task 3.4: Implement Email Service
- [ ] Create `Services/EmailService.cs`
- [ ] Implement SendGrid integration
- [ ] Create email templates (HTML)
- [ ] Add error handling
- [ ] Add logging

**Estimated Time:** 3 hours

---

### Task 3.5: Configure Email Settings
- [ ] Add email settings to `appsettings.json`:
  ```json
  "EmailSettings": {
    "FromEmail": "noreply@lentzlighting.com",
    "FromName": "Lentz Lighting",
    "SendGridApiKey": "your-key-here",
    "AdminEmail": "admin@lentzlighting.com"
  }
  ```
- [ ] Create `EmailSettings` class
- [ ] Register in DI container

**Estimated Time:** 1 hour

---

### Task 3.6: Create Email Templates
- [ ] Create booking confirmation template
- [ ] Create quote request template
- [ ] Create contact form notification template
- [ ] Create admin notification template
- [ ] Use Razor views or string templates

**File Structure:**
```
Views/Emails/
  ├── BookingConfirmation.cshtml
  ├── QuoteRequest.cshtml
  └── ContactForm.cshtml
```

**Estimated Time:** 3 hours

---

### Task 3.7: Update Booking.razor
- [ ] Inject `IEmailService`
- [ ] Send confirmation email after booking save
- [ ] Handle email errors gracefully
- [ ] Log email sending

**Estimated Time:** 1 hour

---

### Task 3.8: Update Contact.razor
- [ ] Inject `IEmailService`
- [ ] Send notification to admin after contact save
- [ ] Send auto-reply to customer (optional)
- [ ] Handle email errors

**Estimated Time:** 1 hour

---

### Task 3.9: Update QuoteCalculator
- [ ] Inject `IEmailService`
- [ ] Send quote request email when "Request Detailed Quote" clicked
- [ ] Include quote details in email
- [ ] Send to admin and customer

**Estimated Time:** 1 hour

---

### Task 3.10: Add Email Logging
- [ ] Log all email sends
- [ ] Log email failures
- [ ] Add email status to database (optional)

**Estimated Time:** 1 hour

---

### Task 3.11: Test Email Functionality
- [ ] Test booking confirmation email
- [ ] Test quote request email
- [ ] Test contact form email
- [ ] Test with invalid email addresses
- [ ] Test error handling

**Estimated Time:** 1 hour

---

**Phase 3 Total Estimated Time:** 12-14 hours (1 week)

---

## 🧪 Phase 4: Testing & Quality Assurance (Weeks 5-6)

### **Goal:** Add comprehensive testing to ensure code quality and prevent regressions

### Task 4.1: Set Up Testing Infrastructure
- [ ] Install xUnit: `dotnet add package xunit`
- [ ] Install bUnit: `dotnet add package bunit`
- [ ] Install Moq: `dotnet add package Moq`
- [ ] Install FluentAssertions: `dotnet add package FluentAssertions`
- [ ] Create test projects:
  - `LentzLighting.Tests` (unit tests)
  - `LentzLighting.ComponentTests` (Blazor component tests)

**Commands:**
```bash
dotnet new xunit -n LentzLighting.Tests
dotnet new xunit -n LentzLighting.ComponentTests
dotnet add LentzLighting.Tests reference LentzLighting
dotnet add LentzLighting.ComponentTests reference LentzLighting
```

**Estimated Time:** 1 hour

---

### Task 4.2: Create Test Base Classes
- [ ] Create `TestBase.cs` for common setup
- [ ] Create `DatabaseTestBase.cs` for database tests
- [ ] Set up in-memory database for testing
- [ ] Create test fixtures

**Estimated Time:** 2 hours

---

### Task 4.3: Write Repository Tests
- [ ] Test `BookingRepository`:
  - Create booking
  - Get booking by ID
  - Get all bookings
  - Update booking
  - Delete booking
- [ ] Test other repositories similarly

**Estimated Time:** 4 hours

---

### Task 4.4: Write Service Tests
- [ ] Test `EmailService`:
  - Mock SendGrid
  - Test email sending
  - Test error handling
- [ ] Test other services

**Estimated Time:** 3 hours

---

### Task 4.5: Write Component Tests (bUnit)
- [ ] Test `QuoteCalculator`:
  - Test calculation logic
  - Test form submission
  - Test navigation
- [ ] Test `AdminLogin`:
  - Test login success
  - Test login failure
  - Test validation
- [ ] Test other components

**Estimated Time:** 4 hours

---

### Task 4.6: Write Integration Tests
- [ ] Test booking flow end-to-end
- [ ] Test contact form flow
- [ ] Test authentication flow
- [ ] Test admin dashboard loading

**Estimated Time:** 4 hours

---

### Task 4.7: Set Up Code Coverage
- [ ] Install coverlet: `dotnet add package coverlet.msbuild`
- [ ] Configure coverage collection
- [ ] Set coverage threshold (aim for 70%+)
- [ ] Add to CI/CD if applicable

**Estimated Time:** 1 hour

---

### Task 4.8: Add Performance Tests (Optional)
- [ ] Test page load times
- [ ] Test database query performance
- [ ] Test email sending performance
- [ ] Add load testing if needed

**Estimated Time:** 2 hours

---

### Task 4.9: Create Test Data Builders
- [ ] Create `BookingBuilder` for test data
- [ ] Create `QuoteBuilder`
- [ ] Create `ContactBuilder`
- [ ] Use builders in all tests

**Estimated Time:** 2 hours

---

### Task 4.10: Run Full Test Suite
- [ ] Run all unit tests
- [ ] Run all component tests
- [ ] Run all integration tests
- [ ] Fix any failing tests
- [ ] Achieve target code coverage

**Estimated Time:** 3 hours

---

**Phase 4 Total Estimated Time:** 26-28 hours (2 weeks)

---

## 📊 Implementation Summary

| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| **Phase 1: Security** | 14 tasks | 12-14 hours | 🔴 Critical |
| **Phase 2: Database** | 14 tasks | 28-30 hours | 🔴 Critical |
| **Phase 3: Email** | 11 tasks | 12-14 hours | 🟡 High |
| **Phase 4: Testing** | 10 tasks | 26-28 hours | 🟡 High |
| **Total** | **49 tasks** | **78-86 hours** | |

**Total Timeline:** 6-8 weeks (assuming 10-12 hours/week)

---

## 🚀 Getting Started

### Prerequisites Checklist:
- [ ] .NET 9.0 SDK installed
- [ ] Visual Studio 2022 or VS Code
- [ ] SQL Server (LocalDB, Express, or full) OR PostgreSQL
- [ ] SendGrid account (for Phase 3)
- [ ] Git repository set up

### Development Environment Setup:

1. **Database Setup:**
   ```bash
   # For SQL Server LocalDB (comes with Visual Studio)
   # No installation needed
   
   # For PostgreSQL
   # Download from: https://www.postgresql.org/download/
   ```

2. **Connection String:**
   Add to `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LentzLighting;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Email Configuration:**
   Add to `appsettings.Development.json`:
   ```json
   {
     "EmailSettings": {
       "FromEmail": "noreply@lentzlighting.com",
       "FromName": "Lentz Lighting",
       "SendGridApiKey": "your-key-here",
       "AdminEmail": "admin@lentzlighting.com"
     }
   }
   ```

---

## 📝 Progress Tracking

Use this checklist to track your progress:

### Phase 1: Security (0/14)
- [ ] Task 1.1: Review Current Authentication
- [ ] Task 1.2: Install NuGet Packages
- [ ] Task 1.3: Create Identity Models
- [ ] Task 1.4: Create ApplicationDbContext
- [ ] Task 1.5: Configure Identity in Program.cs
- [ ] Task 1.6: Create Initial Migration
- [ ] Task 1.7: Create Seed Data
- [ ] Task 1.8: Update AdminLogin.razor
- [ ] Task 1.9: Update Admin.razor
- [ ] Task 1.10: Update AdminMap.razor
- [ ] Task 1.11: Update NavMenu.razor
- [ ] Task 1.12: Add Authorization Policies
- [ ] Task 1.13: Test Authentication Flow
- [ ] Task 1.14: Remove Debug/Test Code

### Phase 2: Database (0/14)
- [ ] Task 2.1: Design Database Schema
- [ ] Task 2.2: Create Entity Models
- [ ] Task 2.3: Update ApplicationDbContext
- [ ] Task 2.4: Create Migration
- [ ] Task 2.5: Create Repository Pattern
- [ ] Task 2.6: Update Booking.razor
- [ ] Task 2.7: Update Contact.razor
- [ ] Task 2.8: Update QuoteCalculator
- [ ] Task 2.9: Update Admin Dashboard
- [ ] Task 2.10: Update AdminMap
- [ ] Task 2.11: Create Seed Data
- [ ] Task 2.12: Add CRUD Operations
- [ ] Task 2.13: Add Data Validation
- [ ] Task 2.14: Test Data Persistence

### Phase 3: Email (0/11)
- [ ] Task 3.1: Choose Email Service
- [ ] Task 3.2: Install Email Package
- [ ] Task 3.3: Create Email Service Interface
- [ ] Task 3.4: Implement Email Service
- [ ] Task 3.5: Configure Email Settings
- [ ] Task 3.6: Create Email Templates
- [ ] Task 3.7: Update Booking.razor
- [ ] Task 3.8: Update Contact.razor
- [ ] Task 3.9: Update QuoteCalculator
- [ ] Task 3.10: Add Email Logging
- [ ] Task 3.11: Test Email Functionality

### Phase 4: Testing (0/10)
- [ ] Task 4.1: Set Up Testing Infrastructure
- [ ] Task 4.2: Create Test Base Classes
- [ ] Task 4.3: Write Repository Tests
- [ ] Task 4.4: Write Service Tests
- [ ] Task 4.5: Write Component Tests
- [ ] Task 4.6: Write Integration Tests
- [ ] Task 4.7: Set Up Code Coverage
- [ ] Task 4.8: Add Performance Tests
- [ ] Task 4.9: Create Test Data Builders
- [ ] Task 4.10: Run Full Test Suite

---

## 🎯 Success Criteria

### Phase 1 Complete When:
- ✅ No hardcoded credentials
- ✅ Authentication uses ASP.NET Core Identity
- ✅ All admin pages require authentication
- ✅ Sessions persist correctly
- ✅ Logout works properly

### Phase 2 Complete When:
- ✅ All forms save to database
- ✅ Admin can view all data
- ✅ CRUD operations work
- ✅ Data persists between sessions
- ✅ Seed data loads correctly

### Phase 3 Complete When:
- ✅ Booking confirmations sent
- ✅ Quote requests sent to admin
- ✅ Contact forms notify admin
- ✅ All emails use templates
- ✅ Error handling works

### Phase 4 Complete When:
- ✅ 70%+ code coverage
- ✅ All tests pass
- ✅ No critical bugs
- ✅ Performance acceptable

---

## 📚 Resources & Documentation

### Microsoft Documentation:
- [ASP.NET Core Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Blazor Server](https://learn.microsoft.com/en-us/aspnet/core/blazor/host-and-deploy/server)

### Email Services:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [SendGrid .NET SDK](https://github.com/sendgrid/sendgrid-csharp)

### Testing:
- [xUnit Documentation](https://xunit.net/)
- [bUnit Documentation](https://bunit.dev/)
- [Moq Documentation](https://github.com/moq/moq4)

---

## ⚠️ Important Notes

1. **Backup First:** Always commit your work before starting a new phase
2. **Test Incrementally:** Test after each task, not just at the end
3. **Document Changes:** Update code comments as you go
4. **Ask for Help:** If stuck on a task for more than 2 hours, seek assistance
5. **Review Code:** Review each phase before moving to the next

---

## 🎉 Next Steps

1. **Review this plan** - Make sure you understand all tasks
2. **Set up environment** - Install required tools
3. **Start Phase 1, Task 1.1** - Begin with reviewing current authentication
4. **Work sequentially** - Complete tasks in order
5. **Track progress** - Check off tasks as you complete them

**Ready to begin? Start with Phase 1, Task 1.1!** 🚀

---

*Plan created: January 2025*  
*Last updated: January 2025*
