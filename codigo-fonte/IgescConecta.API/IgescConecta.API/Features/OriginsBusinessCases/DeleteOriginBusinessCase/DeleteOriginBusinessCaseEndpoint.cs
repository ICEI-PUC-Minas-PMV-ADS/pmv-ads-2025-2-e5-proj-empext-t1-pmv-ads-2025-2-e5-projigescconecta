using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.OriginsBusinessCases.DeleteOriginBusinessCase
{
    [ApiAuthorize]
    [Route("/api/origins-business-cases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "OriginsBusinessCases")]
    public class DeleteOriginBusinessCaseEndpoint: ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteOriginBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{originBusinessCaseId}", Name = "DeleteOriginBusinessCase")]
        public async Task<ActionResult> DeleteOriginBusinessCase(int originBusinessCaseId)
        {
            var result = await _mediator.Send(new DeleteOriginBusinessCaseCommand(originBusinessCaseId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}
