
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportField : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;
    public string Entity { get; set; } = default!;

    public string FieldPath { get; set; } = default!;

    public string Label { get; set; } = default!;

    public FieldDataType DataType { get; set; } = FieldDataType.String;

    public string? FormatHint { get; set; }

    public int DisplayOrder { get; set; }
}

