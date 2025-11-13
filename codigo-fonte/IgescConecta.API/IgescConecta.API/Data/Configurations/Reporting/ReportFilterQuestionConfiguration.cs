
using IgescConecta.Domain.Entities.Reporting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IgescConecta.API.Data.Configurations.Reporting;

public class ReportFilterQuestionConfiguration : IEntityTypeConfiguration<ReportFilterQuestion>
{
    public void Configure(EntityTypeBuilder<ReportFilterQuestion> e)
    {
        e.ToTable("ReportFilterQuestions");
        e.HasKey(x => x.Id);

        e.Property(x => x.FieldPath).IsRequired().HasMaxLength(400);
        e.Property(x => x.DefaultOperator).IsRequired().HasMaxLength(50);
        e.Property(x => x.Label).IsRequired().HasMaxLength(200);
        e.Property(x => x.EnumOptionsJson);

        e.Property(x => x.IsRequired).IsRequired();
        e.Property(x => x.IsDateBase).IsRequired();
        e.Property(x => x.DataType).HasConversion<int>();

        // Máximo 1 "Data Base" por Report
        e.HasIndex(x => new { x.ReportId, x.IsDateBase });
    }
}
