using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Reporting
{
    public interface IReportExecutionService
    {
        Task<ReportExecutionResult> ExecuteAsync(
            int reportId,
            IReadOnlyDictionary<string, string?> filterAnswers,
            CancellationToken cancellationToken = default);
    }
}
