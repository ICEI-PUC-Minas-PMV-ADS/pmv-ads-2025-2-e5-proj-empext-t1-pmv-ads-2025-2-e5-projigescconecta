
using IgescConecta.Domain.Shared;

namespace IgescConecta.Domain.Entities.Reporting;

public class ReportRelation : BaseEntity
{
    public int ReportId { get; set; }
    public Report Report { get; set; } = default!;

    // Caminho técnico a partir da raiz
    public string Path { get; set; } = default!;

    // Para a UI: “pode ter vários” quando true
    public bool IsCollection { get; set; }
}
