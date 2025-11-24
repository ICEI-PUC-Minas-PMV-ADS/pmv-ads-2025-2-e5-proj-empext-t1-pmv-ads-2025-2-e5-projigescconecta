using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.UnpublishReport;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.UnpublishReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    public class UnpublishReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public UnpublishReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("UnpublishReport/{id:int}", Name = "UnpublishReport")]
        public async Task<ActionResult<UnpublishReportResponse>> Unpublish([FromRoute] int id, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new UnpublishReportCommand { Id = id }, ct);
                if (!result.IsSuccess) return BadRequest(result.Error);
                return Ok(new UnpublishReportResponse { Id = result.Value });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class UnpublishReportResponse
    {
        public int Id { get; set; }
    }
}
