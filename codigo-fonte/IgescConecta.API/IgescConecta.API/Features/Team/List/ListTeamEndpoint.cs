using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.ListTeam
{
    /* [ApiAuthorize] */
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
        public async Task<ActionResult<ListTeamViewModel>> ListTeam([FromBody] ListTeamRequest request)
        {
            var result = await _mediator.Send(new ListTeamQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListTeamRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
