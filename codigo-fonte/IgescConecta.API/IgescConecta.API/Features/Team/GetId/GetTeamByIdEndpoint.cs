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
            var result = await _mediator.Send(new GetTeamQuery(teamId));

            var teamInfo = new GetTeamByIdResponse
            {
                TeamId = teamId,
                Name = result.Value.Name,
                LessonTime = result.Value.LessonTime,
                Start = result.Value.Start,
                Finish = result.Value.Finish,
                CourseId = result.Value.CourseId,
                CourseName = result.Value.Course?.Name,
                ProjectProgramId = result.Value.ProjectProgramId,
                ProjectProgramName = result.Value.ProjectProgram?.Name,
                PersonTeamsCount = result.Value.PersonTeams.Count,
                IsDeleted = result.Value.IsDeleted,
                CreatedAt = result.Value.CreatedAt
            };

            return result.IsSuccess
                ? Ok(teamInfo)
                : NotFound(result.Error);
        }
    }

    public class GetTeamByIdResponse
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public int? CourseId { get; set; }
        public string? CourseName { get; set; }
        public int? ProjectProgramId { get; set; }
        public string? ProjectProgramName { get; set; }
        public int PersonTeamsCount { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}