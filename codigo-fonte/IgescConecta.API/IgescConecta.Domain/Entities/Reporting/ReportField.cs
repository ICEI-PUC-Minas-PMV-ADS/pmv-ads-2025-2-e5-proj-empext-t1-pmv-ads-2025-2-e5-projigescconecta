
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportField : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;

    public string FieldPath { get; set; } = default!;

    // Rótulo PT-BR da coluna na UI
    public string Label { get; set; } = default!;

    public FieldDataType DataType { get; set; } = FieldDataType.String;

    // "currency", "percent", "date:short"...
    public string? FormatHint { get; set; }

    // Ordem de exibição no grid
    public int DisplayOrder { get; set; }
}

