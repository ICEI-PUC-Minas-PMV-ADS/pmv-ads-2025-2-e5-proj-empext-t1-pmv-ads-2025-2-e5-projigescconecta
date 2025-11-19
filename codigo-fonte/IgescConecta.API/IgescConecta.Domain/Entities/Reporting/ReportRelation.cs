using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportRelation : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;
    public string FromEntity { get; set; } = default!;
    public string Path { get; set; } = default!;
    public string Entity { get; set; } = default!;
    public string JoinType { get; set; } = default!;
    public string Alias { get; set; } = default!;
    public bool IsCollection { get; set; }
}
