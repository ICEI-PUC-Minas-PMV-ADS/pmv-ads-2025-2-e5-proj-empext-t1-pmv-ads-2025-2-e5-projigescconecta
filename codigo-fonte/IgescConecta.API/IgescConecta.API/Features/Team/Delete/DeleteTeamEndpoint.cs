using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.DeleteTeam
{
    [ApiAuthorize]
    [Route("/api/teams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class DeleteTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{teamId}", Name = "DeleteTeam")]
        public async Task<ActionResult<DeleteTeamResponse>> DeleteTeam(int teamId)
        {
            var result = await _mediator.Send(new DeleteTeamCommand
            {
                TeamId = teamId
            });

            return result.IsSuccess
                ? Ok(new DeleteTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteTeamResponse
    {
        public int TeamId { get; set; }

        public DeleteTeamResponse(int teamId)
        {
            TeamId = teamId;
        }
    }
}