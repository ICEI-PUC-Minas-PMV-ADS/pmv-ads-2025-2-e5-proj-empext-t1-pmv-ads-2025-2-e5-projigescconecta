using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Reporting;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.Run;

[ApiAuthorize]
[ApiController]
[Route("api/reports")]
[ApiExplorerSettings(GroupName = "Reports")]
public class RunReportController : ControllerBase
{
    private readonly IReportExecutionService _reportExecutionService;

    public RunReportController(IReportExecutionService reportExecutionService)
    {
        _reportExecutionService = reportExecutionService;
    }

    [HttpPost("{id:int}/run")]
    public async Task<ActionResult<ReportExecutionResult>> Run(
        int id,
        [FromBody] RunReportRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _reportExecutionService.ExecuteAsync(id, request.Answers, cancellationToken);
        return Ok(result);
    }
}

public class RunReportRequest
{
    public Dictionary<string, string?> Answers { get; set; } = new();
}
