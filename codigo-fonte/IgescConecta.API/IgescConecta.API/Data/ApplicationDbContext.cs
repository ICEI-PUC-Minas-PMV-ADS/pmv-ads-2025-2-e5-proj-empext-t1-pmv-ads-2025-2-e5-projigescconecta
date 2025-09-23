using IgescConecta.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<Beneficiaries>().ToTable("Beneficiaries");
            builder.Entity<BusinessCase>().ToTable("BusinessCases");
            builder.Entity<Company>().ToTable("Companies");
            builder.Entity<Donation>().ToTable("Donations");
            builder.Entity<Osc>().ToTable("Oscs");
            builder.Entity<Person>().ToTable("Persons");
            builder.Entity<PersonCompany>().ToTable("PersonCompanies");
            builder.Entity<PersonOsc>().ToTable("PersonOscs");
            builder.Entity<PersonTeam>().ToTable("PersonTeams");
            builder.Entity<ProjectDocument>().ToTable("ProjectDocuments");
            builder.Entity<ProjectProgram>().ToTable("ProjectPrograms");
            builder.Entity<ProjectTheme>().ToTable("ProjectThemes");
            builder.Entity<ProjectType>().ToTable("ProjectTypes");
            builder.Entity<Course>().ToTable("Courses");
            builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
            builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
            builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}
