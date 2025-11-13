
using IgescConecta.Domain.Entities.Reporting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IgescConecta.API.Data.Configurations.Reporting;

public class ReportSortConfiguration : IEntityTypeConfiguration<ReportSort>
{
    public void Configure(EntityTypeBuilder<ReportSort> e)
    {
        e.ToTable("ReportSorts");
        e.HasKey(x => x.Id);

        e.Property(x => x.FieldPath).IsRequired().HasMaxLength(400);
        e.Property(x => x.Direction).HasConversion<int>();
        e.Property(x => x.Priority).IsRequired();

        e.HasIndex(x => new { x.ReportId, x.Priority }).IsUnique();
    }
}

