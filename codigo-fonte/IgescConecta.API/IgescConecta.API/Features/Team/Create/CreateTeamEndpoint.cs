using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Enums;
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

        [HttpPost("CreateTeam", Name="CreateTeam")]
        public async Task<ActionResult<CreateTeamResponse>> CreateTeam([FromBody] CreateTeamRequest request)
        {
            var result = await _mediator.Send(new CreateTeamCommand
            {
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                Year = request.Year,
                Semester = request.Semester,
                ModalityType = request.ModalityType,
                EventType = request.EventType,
                ProjectProgramsIds = request.ProjectProgramsIds,
                CourseId = request.CourseId
            });

            return result.IsSuccess
                ? Ok(new CreateTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreateTeamRequest
    {
        [Required(ErrorMessage = "O nome da turma é obrigatório.")]
        public required string Name { get; set; }

        public string? LessonTime { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        [Required(ErrorMessage = "O ano é obrigatório.")]
        public required int Year { get; set; }

        [Required(ErrorMessage = "O semestre é obrigatório.")]
        public required string Semester { get; set; }

        [Required(ErrorMessage = "A modalidade é obrigatória.")]
        public required ModalityType ModalityType { get; set; }

        [Required(ErrorMessage = "O tipo de evento é obrigatório.")]
        public required EventType EventType { get; set; }

        public List<int> ProjectProgramsIds { get; set; } = [];

        [Required(ErrorMessage = "Pelo menos um Programa é obrigatório.")]
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
