using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.PublishReport;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.PublishReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    public class PublishReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public PublishReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("PublishReport/{id:int}", Name = "PublishReport")]
        public async Task<ActionResult<PublishReportResponse>> Publish([FromRoute] int id, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new PublishReportCommand { Id = id }, ct);
                if (!result.IsSuccess) return BadRequest(result.Error);
                return Ok(new PublishReportResponse { Id = result.Value });
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

    public class PublishReportResponse
    {
        public int Id { get; set; }
    }
}

