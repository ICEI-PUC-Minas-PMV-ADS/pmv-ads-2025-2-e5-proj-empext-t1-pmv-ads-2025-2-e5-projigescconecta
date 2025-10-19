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
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                PersonTeamsIds = request.PersonTeamsIds,
                ProjectProgramId = request.ProjectProgramId,
                CourseId = request.CourseId
            });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            var editResponse = new EditTeamResponse
            {
                TeamId = teamId,
                Name = result.Value.Name
            };

            return Ok(editResponse);
        }
    }

    public class EditTeamRequest
    {
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public List<int>? PersonTeamsIds { get; set; }
        public int? ProjectProgramId { get; set; }
        public int? CourseId { get; set; }
    }

    public class EditTeamResponse
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
    }
}