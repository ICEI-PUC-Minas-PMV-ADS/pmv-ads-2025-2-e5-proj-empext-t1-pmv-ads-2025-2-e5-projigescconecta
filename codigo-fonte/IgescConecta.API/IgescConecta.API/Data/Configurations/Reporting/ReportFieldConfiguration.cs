
using IgescConecta.Domain.Entities.Reporting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IgescConecta.API.Data.Configurations.Reporting;

public class ReportFieldConfiguration : IEntityTypeConfiguration<ReportField>
{
    public void Configure(EntityTypeBuilder<ReportField> e)
    {
        e.ToTable("ReportFields");
        e.HasKey(x => x.Id);

        e.Property(x => x.FieldPath).IsRequired().HasMaxLength(400);
        e.Property(x => x.Label).IsRequired().HasMaxLength(200);
        e.Property(x => x.FormatHint).HasMaxLength(100);
        e.Property(x => x.DataType).HasConversion<int>();

        e.HasIndex(x => new { x.ReportId, x.DisplayOrder });
    }
}
