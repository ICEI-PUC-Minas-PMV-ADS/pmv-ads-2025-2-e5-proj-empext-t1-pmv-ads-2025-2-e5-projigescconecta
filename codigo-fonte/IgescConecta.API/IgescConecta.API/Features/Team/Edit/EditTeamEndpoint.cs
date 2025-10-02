using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.EditTeam
{
    [ApiAuthorize]
    [Route("/api/teams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class EditTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public EditTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{teamId}", Name = "EditTeam")]
        public async Task<ActionResult<EditTeamResponse>> EditTeam(int teamId, [FromBody] EditTeamRequest request)
        {
            var result = await _mediator.Send(new EditTeamCommand
            {
                TeamId = teamId,
                Start = request.Start,
                Finish = request.Finish,
                ProjectProgramId = request.ProjectProgramId,
                CourseId = request.CourseId
            });

            return result.IsSuccess
                ? Ok(new EditTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class EditTeamRequest
    {
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public int ProjectProgramId { get; set; }
        public int CourseId { get; set; }
    }

    public class EditTeamResponse
    {
        public int TeamId { get; set; }

        public EditTeamResponse(int teamId)
        {
            TeamId = teamId;
        }
    }
}