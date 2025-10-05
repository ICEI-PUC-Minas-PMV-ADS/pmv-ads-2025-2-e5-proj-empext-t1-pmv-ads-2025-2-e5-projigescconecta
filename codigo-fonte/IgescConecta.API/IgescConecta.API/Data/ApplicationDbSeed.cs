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

            var viewerRole = new Role("Viewer");
            viewerRole.NormalizedName = viewerRole.Name!.ToUpper();

            var roles = new List<Role> { adminRole, editorRole, viewerRole };

            _context.Roles.AddRange(roles);
            _context.SaveChanges();

            User CreateUser(string name, string email, string? phone = null)
            {
                var user = new User
                {
                    UserName = email,
                    Email = email,
                    Name = name,
                    IsActive = true,
                    PhoneNumber = phone ?? RandomPhone(),
                    EmailConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D")
                };

                user.NormalizedUserName = user.UserName!.ToUpper();
                user.NormalizedEmail = user.Email!.ToUpper();
                user.PasswordHash = passwordHasher.HashPassword(user, pwd);

                return user;
            }

            // Gerador simples de número "aleatório" de 11 dígitos (apenas para seed/dev)
            string RandomPhone()
            {
                var rng = Random.Shared;
                // DDD 11–99, seguido de 9 dígitos
                var ddd = rng.Next(11, 99);
                var rest = rng.NextInt64(1000000000L, 9999999999L); // 10 dígitos
                // Monta como string, garantindo 11 dígitos no total (padrão BR sem formatação)
                return $"{ddd}{rest}".Substring(0, 11);
            }

            // ---- Usuários ------------------------------------------------------
            var users = new List<User>
            {
                // Administrador padrão
                CreateUser("Administrador", "admin@admin.com", "19954213678"),
            };

            _context.Users.AddRange(users);
            _context.SaveChanges();

            // ---- Atribuição de papéis ------------------------------------------
            // Mapa: email -> role
            var assignments = new (string Email, string Role)[]
            {
                ("admin@admin.com", "Admin"),
            };

            var userRoles = new List<IdentityUserRole<int>>();

            foreach (var (email, roleName) in assignments)
            {
                var u = users.FirstOrDefault(x => x.Email!.Equals(email, StringComparison.OrdinalIgnoreCase));
                var r = roles.FirstOrDefault(x => x.Name!.Equals(roleName, StringComparison.OrdinalIgnoreCase));

                if (u != null && r != null)
                {
                    userRoles.Add(new IdentityUserRole<int>
                    {
                        UserId = u.Id,
                        RoleId = r.Id
                    });
                }
            }

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
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred while migrating or seeding the database.");
            }
        }
    }
}
