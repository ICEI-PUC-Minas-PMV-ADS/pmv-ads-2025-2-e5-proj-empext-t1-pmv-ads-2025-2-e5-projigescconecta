
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportFilterQuestion : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;
    public string Entity { get; set; } = default!;
    public string FieldPath { get; set; } = default!;
    public string DefaultOperator { get; set; } = "Contains";
    public FieldDataType DataType { get; set; } = FieldDataType.String;
    public bool IsRequired { get; set; }
    public bool IsDateBase { get; set; }
    public string Label { get; set; } = default!;
    public string? EnumOptionsJson { get; set; }
}

