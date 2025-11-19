
using IgescConecta.Domain.Enums;
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class Report : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }

    // Entidade raiz 
    public string RootEntity { get; set; } = default!;

    public ReportStatus Status { get; set; } = ReportStatus.Draft;
    public bool ReaderCanExecute { get; set; }

    // Navegações
    public ICollection<ReportRelation> Relations { get; set; } = new List<ReportRelation>();
    public ICollection<ReportField> Fields { get; set; } = new List<ReportField>();
    public ICollection<ReportFilterQuestion> FilterQuestions { get; set; } = new List<ReportFilterQuestion>();
    public ICollection<ReportSort> Sorts { get; set; } = new List<ReportSort>();
}
