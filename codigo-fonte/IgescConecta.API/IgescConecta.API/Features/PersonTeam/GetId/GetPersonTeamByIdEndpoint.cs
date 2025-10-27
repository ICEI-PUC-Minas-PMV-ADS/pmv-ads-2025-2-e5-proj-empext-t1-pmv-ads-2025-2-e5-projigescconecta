using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonTeams.GetPersonTeamById
{
    [ApiAuthorize]
    [Route("/api/personteams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonTeams")]
    public class GetPersonTeamByIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetPersonTeamByIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id}", Name = "GetPersonTeamById")]
        public async Task<ActionResult<PersonTeamDetailDto>> GetPersonTeamById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetPersonTeamByIdQuery { Id = id });

            return result.IsSuccess
                ? Ok(result.Value)
                : NotFound(result.Error);
        }
    }
}