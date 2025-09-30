using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Oscs.DeleteOsc
{
    [ApiAuthorize]
    [Route("/api/osc")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Oscs")]
    public class DeleteOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{oscId}", Name = "DeleteOsc")]
        public async Task<ActionResult> DeleteOsc(int oscId)
        {
            var result = await _mediator.Send(new DeleteOscCommand(oscId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}
