using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using IgescConecta.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace IgescConecta.API.Features.Teams.EditTeam
{
    [ApiAuthorize]
    [ApiController]
    [Route("api/teams")]
    [ApiExplorerSettings(GroupName = "Teams")]
    public class EditTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public EditTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{teamId}", Name="EditTeam")]
        public async Task<IActionResult> EditTeam(int teamId, EditTeamRequest request)
        {
            var command = new EditTeamCommand
            {
                TeamId = teamId,
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                Year = request.Year,
                Semester = request.Semester,
                ModalityType = request.ModalityType,
                EventType = request.EventType,
                ProjectProgramIds = request.ProjectProgramIds,
                CourseId = request.CourseId
            };

            var result = await _mediator.Send(command);

            if (result.IsFailure)
            {
                return BadRequest(result.Error.Errors);
            }

            return Ok(new
            {
                result.Value.Id,
                result.Value.Name,
                result.Value.LessonTime,
                result.Value.Start,
                result.Value.Finish,
                result.Value.Year,
                result.Value.Semester,
                ModalityType = result.Value.ModalityType,
                EventType = result.Value.EventType,
                PersonTeamsCount = result.Value.PersonTeams.Count,
                ProjectPrograms = result.Value.ProjectPrograms.Select(pp => new
                {
                    Id = pp.Id,
                    Name = pp.Name
                }).ToList(),
                CourseId = result.Value.CourseId,
                CourseName = result.Value.Course?.Name
            });
        }
    }

    public class EditTeamRequest
    {
        [Required(ErrorMessage = "O nome da turma é obrigatório quando fornecido.")]
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public List<int>? ProjectProgramIds { get; set; }
        public int? CourseId { get; set; }
        public int? Year { get; set; }
        public string? Semester { get; set; }
        public ModalityType? ModalityType { get; set; }
        public EventType? EventType { get; set; }
    }
}