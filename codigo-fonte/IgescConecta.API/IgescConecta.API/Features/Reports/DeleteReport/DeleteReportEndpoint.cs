using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.DeleteReport;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.DeleteReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    [Authorize(Roles = "Admin,Editor")]
    public class DeleteReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public DeleteReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpDelete("DeleteReport/{id:int}", Name = "DeleteReport")]
        public async Task<ActionResult<DeleteReportResponse>> Delete([FromRoute] int id, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new DeleteReportCommand { Id = id }, ct);
                if (!result.IsSuccess) return BadRequest(result.Error);

                return Ok(new DeleteReportResponse { Id = result.Value });
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

    public class DeleteReportResponse
    {
        public int Id { get; set; }
    }
}

