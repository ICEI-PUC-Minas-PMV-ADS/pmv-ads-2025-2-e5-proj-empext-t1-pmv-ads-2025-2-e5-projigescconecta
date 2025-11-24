using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonOscs.DeletePersonOsc
{
    [ApiAuthorize]
    [Route("/api/person-osc")]
    [ApiAuthorize]
    [ApiExplorerSettings(GroupName = "PersonOsc")]
    public class DeletePersonOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeletePersonOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{personOscId}", Name = "DeletePersonOsc")]
        public async Task<ActionResult> DeletePersonOsc(int personOscId)
        {
            var result = await _mediator.Send(new DeletePersonOscCommand(personOscId));
            return result.IsSuccess ? Ok(result) : BadRequest(result.Error);
        }
    }
}
