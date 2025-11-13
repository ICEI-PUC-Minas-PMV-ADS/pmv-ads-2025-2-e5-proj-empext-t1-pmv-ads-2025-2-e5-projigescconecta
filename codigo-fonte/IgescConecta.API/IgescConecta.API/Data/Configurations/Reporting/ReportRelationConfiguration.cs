
using IgescConecta.Domain.Entities.Reporting;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace IgescConecta.API.Data.Configurations.Reporting;

public class ReportRelationConfiguration : IEntityTypeConfiguration<ReportRelation>
{
    public void Configure(EntityTypeBuilder<ReportRelation> e)
    {
        e.ToTable("ReportRelations");
        e.HasKey(x => x.Id);

        e.Property(x => x.Path).IsRequired().HasMaxLength(400);
        e.Property(x => x.IsCollection).IsRequired();

        e.HasIndex(x => new { x.ReportId, x.Path }).IsUnique();
    }
}
