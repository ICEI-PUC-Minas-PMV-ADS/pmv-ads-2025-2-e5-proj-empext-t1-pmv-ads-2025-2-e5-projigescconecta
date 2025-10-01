using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.DeleteTeam
{
    /* [ApiAuthorize] */
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

        [HttpDelete("DeleteTeam", Name = "DeleteTeam")]
        public async Task<ActionResult<DeleteTeamResponse>> DeleteTeam([FromBody] DeleteTeamRequest request)
        {
            var result = await _mediator.Send(new DeleteTeamCommand
            {
                TeamId = request.TeamId,
                DeactivatedByUserId = request.DeactivatedByUserId
            });

            return result.IsSuccess
                ? Ok(new DeleteTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteTeamRequest
    {
        public int TeamId { get; set; }
        public int DeactivatedByUserId { get; set; } // Quem está desativando
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
