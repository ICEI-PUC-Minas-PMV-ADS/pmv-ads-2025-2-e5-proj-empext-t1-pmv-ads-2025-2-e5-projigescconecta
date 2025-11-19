
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportSort : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;

    // Ordenar apenas por campos escalares
    public string FieldPath { get; set; } = default!;

    public SortDirection Direction { get; set; } = SortDirection.Asc;

    public int Priority { get; set; } = 1;
}

