using IgescConecta.API.Common.Validation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.DeleteTeam
{
    [ApiController]
    [Route("api/teams")]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class DeleteTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var command = new DeleteTeamCommand
            {
                TeamId = teamId
            };

            var result = await _mediator.Send(command);

            if (result.IsFailure)
            {
                return BadRequest(result.Error.Errors);
            }

            return Ok(new DeleteTeamResponse(result.Value));
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