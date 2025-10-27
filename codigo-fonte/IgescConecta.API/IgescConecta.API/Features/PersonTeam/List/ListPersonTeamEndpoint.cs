using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonTeams.ListPersonTeam
{
    [ApiAuthorize]
    [Route("/api/personteams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonTeams")]
    public class ListPersonTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListPersonTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet(Name = "ListPersonTeams")]
        public async Task<ActionResult<List<PersonTeamDto>>> ListPersonTeams()
        {
            var result = await _mediator.Send(new ListPersonTeamQuery());
            return Ok(result);
        }

        [HttpGet("byteam/{teamId}", Name = "ListPersonTeamsByTeam")]
        public async Task<ActionResult<List<PersonTeamDto>>> ListPersonTeamsByTeam([FromRoute] int teamId)
        {
            var result = await _mediator.Send(new ListPersonTeamQuery { TeamId = teamId });
            return Ok(result);
        }
    }
}