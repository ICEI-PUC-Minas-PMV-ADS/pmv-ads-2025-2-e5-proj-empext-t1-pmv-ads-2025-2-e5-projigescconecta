using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Shared;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Security.Claims;

namespace IgescConecta.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, IHttpContextAccessor contextAccessor) : base(options)
        {
            _contextAccessor = contextAccessor;
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<Company> Companies { get; set; }

        public DbSet<Course> Courses { get; set; }

        public DbSet<Donation> Donations { get; set; }

        public DbSet<OriginBusinessCase> OriginBusinessCases { get; set; }

        public DbSet<Osc> Oscs { get; set; }

        public DbSet<Beneficiaries> Beneficiaries { get; set; }

        public DbSet<BusinessCase> BusinessCases { get; set; }

        public DbSet<Person> Persons { get; set; }

        public DbSet<PersonCompany> PersonCompanies { get; set; }

        public DbSet<PersonOsc> PersonOscs { get; set; }

        public DbSet<PersonTeam> PersonTeams { get; set; }

        public DbSet<ProjectProgram> ProjectPrograms { get; set; }

        public DbSet<ProjectDocument> ProjectDocuments { get; set; }

        public DbSet<ProjectTheme> projectThemes { get; set; }

        public DbSet<ProjectType> ProjectTypes { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
            builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
            builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void OnBeforeSaving()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity || x.Entity is User)
                .ToList();
            UpdateTimestamps(entities);
        }

        private void UpdateTimestamps(List<EntityEntry> entries)
        {
            var filtred = entries
                .Where(x => x.State == EntityState.Added
                || x.State == EntityState.Modified);

            var currentUserId = Convert.ToInt32(_contextAccessor?.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            foreach (var entry in filtred)
            {
                if(entry.Entity is User user)
                {
                    if(entry.State == EntityState.Added)
                    {
                        user.CreatedAt = DateTime.UtcNow;
                        user.CreatedBy = currentUserId;
                    }

                    user.UpdatedAt = DateTime.UtcNow;
                    user.UpdatedBy = currentUserId;
                }
                if(entry.Entity is BaseEntity entity)
                {
                    if(entry.State == EntityState.Modified)
                    {
                        entity.CreatedAt = DateTime.UtcNow;
                        entity.CreatedBy = currentUserId;
                    }

                    entity.UpdatedAt = DateTime.UtcNow;
                    entity.UpdatedBy = currentUserId;
                }
            }
        }
    }
}
