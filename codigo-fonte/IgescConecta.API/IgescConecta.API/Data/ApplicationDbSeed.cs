using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Data
{
    public class ApplicationDbSeed
    {
        private readonly ApplicationDbContext _context;

        public ApplicationDbSeed(ApplicationDbContext context)
        {
            this._context = context;
        }

        public void Seed()
        {
            if (_context.Users.Any())
                return;

            var pwd = "123@Mudar";
            var passwordHasher = new PasswordHasher<User>();

            var adminRole = new Role("Admin");
            adminRole.NormalizedName = adminRole.Name!.ToUpper();

            var editorRole = new Role("Editor");
            editorRole.NormalizedName = editorRole.Name!.ToUpper();

            var vieweRole = new Role("Viewer");
            vieweRole.NormalizedName = vieweRole.Name!.ToUpper();

            var roles = new List<Role> { adminRole, editorRole, vieweRole };

            _context.Roles.AddRange(roles);
            _context.SaveChanges();

            var adminUser = new User
            {
                UserName = "admin@admin.com",
                Name = "Administrador",
                Email = "admin@admin.com",
                IsActive = true,
                PhoneNumber = "19954213678",
                EmailConfirmed = true,
                SecurityStamp = Guid.NewGuid().ToString("D")
            };
            adminUser.NormalizedUserName = adminUser.UserName.ToUpper();
            adminUser.NormalizedEmail = adminUser.Email.ToUpper();
            adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, pwd);

            var users = new List<User> { adminUser };

            _context.Users.AddRange(users);
            _context.SaveChanges();

            var userRoles = new List<IdentityUserRole<int>>
            {
                new()
                {
                    UserId = users[0].Id,
                    RoleId = roles.First(q => q.Name == "Admin").Id,
                }
            };

            _context.UserRoles.AddRange(userRoles);
            _context.SaveChanges();
        }
    }

    public static class ApplicationExtensions
    {
        public static void SeedDatabase(this IApplicationBuilder app, bool isDevelopment)
        {
            using var scope = app.ApplicationServices.CreateScope();
            var services = scope.ServiceProvider;
            try
            {
               var context = services.GetRequiredService<ApplicationDbContext>();
                if (!isDevelopment)
                    context.Database.Migrate();
                var seeder = new ApplicationDbSeed(context);
                seeder.Seed();
            }
            catch(Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            }
        }
    }
}
