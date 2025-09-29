using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.BusinessCases.DeleteBusinessCase
{
    [ApiAuthorize]
    [Route("/api/businesscase")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "BusinessCases")]
    public class DeleteBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public DeleteBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{businessCaseId}", Name = "DeleteBusinessCase")]
        public async Task<ActionResult> DeleteBusinessCase(int businessCaseId)
        {
            var result = await _mediator.Send(new DeleteBusinessCaseCommand(businessCaseId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}
