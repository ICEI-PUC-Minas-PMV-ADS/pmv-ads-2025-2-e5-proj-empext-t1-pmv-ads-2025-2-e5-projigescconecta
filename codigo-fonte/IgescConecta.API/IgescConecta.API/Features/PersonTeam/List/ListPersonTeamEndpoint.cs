using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
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
            var query = new ListPersonTeamQuery(1, int.MaxValue, new())
            {
                TeamId = null
            };
            var result = await _mediator.Send(query);
            return Ok(result.Items);
        }

        [HttpGet("byteam/{teamId}", Name = "ListPersonTeamsByTeam")]
        public async Task<ActionResult<List<PersonTeamDto>>> ListPersonTeamsByTeam([FromRoute] int teamId)
        {
            var query = new ListPersonTeamQuery(1, int.MaxValue, new())
            {
                TeamId = teamId
            };
            var result = await _mediator.Send(query);
            return Ok(result.Items);
        }

        [HttpPost("search", Name = "SearchPersonTeams")]
        public async Task<ActionResult<ListPersonTeamViewModel>> SearchPersonTeams([FromBody] ListPersonTeamRequest request)
        {
            var query = new ListPersonTeamQuery(request.PageNumber, request.PageSize, request.Filters ?? new())
            {
                TeamId = request.TeamId
            };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }

    public class ListPersonTeamRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public int? TeamId { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
