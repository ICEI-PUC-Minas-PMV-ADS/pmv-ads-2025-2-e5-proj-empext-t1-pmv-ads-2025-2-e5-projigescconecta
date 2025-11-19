
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportFilterQuestion : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;

    // Campo alvo (pode ser relação; coleções terão semântica "qualquer item" na execução)
    public string FieldPath { get; set; } = default!;

    // Ex.: "Contains", "Equals", "In"...
    public string DefaultOperator { get; set; } = "Contains";

    public FieldDataType DataType { get; set; } = FieldDataType.String;

    public bool IsRequired { get; set; }
    public bool IsDateBase { get; set; } // máx. 1 por Report
    public string Label { get; set; } = default!;

    // Quando enum/multi
    public string? EnumOptionsJson { get; set; }
}

