
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IgescConecta.API.Data.Configurations.Reporting;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> e)
    {
        e.ToTable("Reports");
        e.HasKey(x => x.Id);

        e.Property(x => x.Name).IsRequired().HasMaxLength(200);
        e.Property(x => x.Description).HasMaxLength(1000);
        e.Property(x => x.RootEntity).IsRequired().HasMaxLength(200);

        e.Property(x => x.Status).HasConversion<int>().HasDefaultValue(ReportStatus.Draft);
        e.Property(x => x.ReaderCanExecute).HasDefaultValue(false);

        e.HasIndex(x => x.Name);
        e.HasIndex(x => new { x.RootEntity, x.Status });

        // Hard delete: CASCADE nas filhas
        e.HasMany(x => x.Relations)
         .WithOne(x => x.Report)
         .HasForeignKey(x => x.ReportId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(x => x.Fields)
         .WithOne(x => x.Report)
         .HasForeignKey(x => x.ReportId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(x => x.FilterQuestions)
         .WithOne(x => x.Report)
         .HasForeignKey(x => x.ReportId)
         .OnDelete(DeleteBehavior.Cascade);

        e.HasMany(x => x.Sorts)
         .WithOne(x => x.Report)
         .HasForeignKey(x => x.ReportId)
         .OnDelete(DeleteBehavior.Cascade);
    }
}

