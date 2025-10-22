using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.ListTeams
{
    [ApiAuthorize]
    [Route("/api/teams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class ListTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListTeam", Name = "ListTeam")]
        public async Task<ActionResult<ListTeamViewModel>> ListTeams([FromBody] ListTeamRequest request)
        {
            var result = await _mediator.Send(new ListTeamQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListTeamRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
    }
}