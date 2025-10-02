using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
    [ApiAuthorize]
    [Route("/api/teams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class CreateTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost(Name = "CreateTeam")]
        public async Task<ActionResult<CreateTeamResponse>> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var result = await _mediator.Send(new CreateTeamCommand
            {
                Start = request.Start,
                Finish = request.Finish,
                ProjectProgramId = request.ProjectProgramId,
                CourseId = request.CourseId
            });

            return result.IsSuccess
                ? Ok(new CreateTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreateTeamRequest
    {
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public int ProjectProgramId { get; set; }
        public int CourseId { get; set; }
    }

    public class CreateTeamResponse
    {
        public int TeamId { get; set; }

        public CreateTeamResponse(int teamId)
        {
            TeamId = teamId;
        }
    }
}