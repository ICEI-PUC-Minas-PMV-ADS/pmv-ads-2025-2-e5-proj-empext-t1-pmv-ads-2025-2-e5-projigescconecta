using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using IgescConecta.Domain.Entities;
using System.ComponentModel.DataAnnotations;

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

        [HttpPost("CreateTeam", Name = "CreateTeam")]
        public async Task<ActionResult<CreateTeamResponse>> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var result = await _mediator.Send(new CreateTeamCommand
            {
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                PersonTeamsIds = request.PersonTeamsIds,
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
        public string? Name { get; set; }

        public string? LessonTime { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public List<int> PersonTeamsIds { get; set; } = [];
        public int? ProjectProgramId { get; set; }
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
