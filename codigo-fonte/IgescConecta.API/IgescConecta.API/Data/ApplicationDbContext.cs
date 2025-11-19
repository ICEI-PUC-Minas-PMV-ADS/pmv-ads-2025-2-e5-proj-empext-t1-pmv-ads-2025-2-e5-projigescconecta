using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Primitives;
using IgescConecta.Domain.Shared;
using IgescConecta.Domain.Entities.Reporting; // << adiciona as entidades de Reporting

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Linq.Expressions;

using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<User, Role, int>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public bool DisableAuditing { get; set; }

        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options,
            IHttpContextAccessor contextAccessor) : base(options)
        {
            _contextAccessor = contextAccessor;
        }

        // ---------------------------
        // DbSets existentes
        // ---------------------------
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Donation> Donations { get; set; }
        public DbSet<OriginBusinessCase> OriginBusinessCases { get; set; }
        public DbSet<Osc> Oscs { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<BusinessCase> BusinessCases { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<PersonCompany> PersonCompanies { get; set; }
        public DbSet<PersonOsc> PersonOscs { get; set; }
        public DbSet<PersonTeam> PersonTeams { get; set; }
        public DbSet<ProjectProgram> ProjectPrograms { get; set; }
        public DbSet<ProjectDocument> ProjectDocuments { get; set; }
        public DbSet<ProjectTheme> ProjectThemes { get; set; }
        public DbSet<ProjectType> ProjectTypes { get; set; }

        // ---------------------------
        // DbSets do Gerador de Relatórios
        // ---------------------------
        public DbSet<Report> Reports { get; set; }
        public DbSet<ReportRelation> ReportRelations { get; set; }
        public DbSet<ReportField> ReportFields { get; set; }
        public DbSet<ReportFilterQuestion> ReportFilterQuestions { get; set; }
        public DbSet<ReportSort> ReportSorts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Relacionamentos User -> audit trail
            builder.Entity<User>()
                .HasOne(u => u.CreatedByUser)
                .WithMany()
                .HasForeignKey(u => u.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<User>()
                .HasOne(u => u.UpdatedByUser)
                .WithMany()
                .HasForeignKey(u => u.UpdatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Query filters (soft delete) das entidades existentes
            builder.Entity<Company>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Course>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Team>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Donation>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<OriginBusinessCase>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Osc>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Beneficiary>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<BusinessCase>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Person>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<PersonCompany>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<PersonOsc>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<PersonTeam>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<ProjectProgram>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<ProjectDocument>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<ProjectTheme>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<ProjectType>().HasQueryFilter(e => !e.IsDeleted);

            // Tabelas de identidade
            builder.Entity<User>().ToTable("Users");
            builder.Entity<Role>().ToTable("Roles");
            builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
            builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
            builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");

            // Aplica todas as configurations (inclui Reporting/*Configuration.cs)
            builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }

        public override int SaveChanges(bool acceptAllChangesOnSuccess)
        {
            OnBeforeSaving();
            return base.SaveChanges(acceptAllChangesOnSuccess);
        }

        public override async Task<int> SaveChangesAsync(
            bool acceptAllChangesOnSuccess,
            CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();
            return await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        private void OnBeforeSaving()
        {
            if (DisableAuditing) return;

            var entries = ChangeTracker.Entries()
                .Where(x => x.Entity is BaseEntity || x.Entity is User)
                .ToList();

            // Soft delete global: transformar Deleted -> IsDeleted = true,
            // EXCETO para as entidades do Gerador de Relatórios (hard delete nelas).
            var softDeleteEntries = ChangeTracker
                .Entries<ISoftDeletable>()
                .Where(e => e.State == EntityState.Deleted)
                .Where(e => e.Entity is not Report
                         && e.Entity is not ReportRelation
                         && e.Entity is not ReportField
                         && e.Entity is not ReportFilterQuestion
                         && e.Entity is not ReportSort);

            foreach (var entityEntry in softDeleteEntries)
            {
                entityEntry.State = EntityState.Modified;
                entityEntry.Property(nameof(ISoftDeletable.IsDeleted)).CurrentValue = true;
            }

            UpdateTimestamps(entries);
        }

        private void UpdateTimestamps(List<EntityEntry> entries)
        {
            var filtred = entries.Where(x =>
                x.State == EntityState.Added || x.State == EntityState.Modified);

            var currentUserIdStr = _contextAccessor?.HttpContext?.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            int.TryParse(currentUserIdStr, out var currentUserId);

            foreach (var entry in filtred)
            {
                if (entry.Entity is User user)
                {
                    if (entry.State == EntityState.Added)
                    {
                        user.CreatedAt = DateTime.UtcNow;
                        if (currentUserId > 0) user.CreatedBy = currentUserId;
                    }

                    user.UpdatedAt = DateTime.UtcNow;
                    if (currentUserId > 0) user.UpdatedBy = currentUserId;
                }
                else if (entry.Entity is BaseEntity entity)
                {
                    if (entry.State == EntityState.Added)
                    {
                        entity.CreatedAt = DateTime.UtcNow;
                        if (currentUserId > 0) entity.CreatedBy = currentUserId;
                    }

                    entity.UpdatedAt = DateTime.UtcNow;
                    if (currentUserId > 0) entity.UpdatedBy = currentUserId;
                }
            }
        }
    }
}
