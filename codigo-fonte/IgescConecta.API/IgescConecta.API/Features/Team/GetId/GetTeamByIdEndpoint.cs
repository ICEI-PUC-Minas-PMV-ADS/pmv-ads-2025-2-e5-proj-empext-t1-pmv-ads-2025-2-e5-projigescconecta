using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.GetTeamById
{
    [ApiAuthorize]
    [Route("/api/teams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class GetTeamByIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetTeamByIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{teamId}", Name = "GetTeamById")]
        public async Task<ActionResult<GetTeamByIdResponse>> GetTeamById(int teamId)
        {
            var result = await _mediator.Send(new GetTeamByIdQuery
            {
                TeamId = teamId
            });

            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(result.Error);
        }
    }
}