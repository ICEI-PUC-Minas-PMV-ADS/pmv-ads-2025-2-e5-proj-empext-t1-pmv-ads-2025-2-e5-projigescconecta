using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonTeams.DeletePersonTeam
{
    [ApiAuthorize]
    [Route("/api/personteams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonTeams")]
    public class DeletePersonTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeletePersonTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{id}", Name = "DeletePersonTeam")]
        public async Task<ActionResult<DeletePersonTeamResponse>> DeletePersonTeam([FromRoute] int id)
        {
            var result = await _mediator.Send(new DeletePersonTeamCommand { Id = id });

            return result.IsSuccess
                ? Ok(new DeletePersonTeamResponse(true))
                : BadRequest(result.Error);
        }
    }

    public class DeletePersonTeamResponse
    {
        public bool Success { get; set; }

        public DeletePersonTeamResponse(bool success)
        {
            Success = success;
        }
    }
}