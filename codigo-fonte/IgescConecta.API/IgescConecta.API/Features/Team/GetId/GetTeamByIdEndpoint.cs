using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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

            if (!result.IsSuccess)
                return NotFound(result.Error);

            var teamInfo = new GetTeamByIdResponse
            {
                TeamId = teamId,
                Name = result.Value.Name,
                LessonTime = result.Value.LessonTime,
                Start = result.Value.Start,
                Finish = result.Value.Finish,
                Year = result.Value.Year,
                Semester = result.Value.Semester,
                ModalityType = result.Value.ModalityType,
                EventType = result.Value.EventType,
                CourseId = result.Value.CourseId,
                CourseName = result.Value.Course?.Name,
                ProjectProgramsCount = result.Value.ProjectPrograms.Count,
                PersonTeamsCount = result.Value.PersonTeams.Count,
                IsDeleted = result.Value.IsDeleted,
                CreatedAt = result.Value.CreatedAt
            };

            return Ok(teamInfo);
        }
    }

    public class GetTeamByIdResponse
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public int Year { get; set; }
        public string Semester { get; set; }
        public ModalityType ModalityType { get; set; }
        public EventType EventType { get; set; }
        public int CourseId { get; set; }
        public string? CourseName { get; set; }
        public int ProjectProgramsCount { get; set; }
        public int PersonTeamsCount { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}