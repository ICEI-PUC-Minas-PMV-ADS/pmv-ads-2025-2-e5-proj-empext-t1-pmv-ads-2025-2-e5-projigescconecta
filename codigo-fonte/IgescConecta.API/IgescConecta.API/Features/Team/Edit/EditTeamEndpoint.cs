// EditTeamEndpoint.cs
using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.EditTeam
{
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

        [HttpPatch("EditTeam", Name = "EditTeam")]
        public async Task<ActionResult<EditTeamResponse>> EditTeam([FromBody] EditTeamRequest request)
        {
            var result = await _mediator.Send(new EditTeamCommand
            {
                TeamId = request.TeamId,
                Name = request.Name,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Time = request.Time,
                CourseId = request.CourseId,
                UpdatedByUserId = request.UpdatedByUserId
            });

            return result.IsSuccess
                ? Ok(new EditTeamResponse(result.Value.Id, result.Value.Name))
                : BadRequest(result.Error);
        }
    }

    public class EditTeamRequest
    {
        public int TeamId { get; set; }

        // Campos opcionais
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Time { get; set; }
        public int? CourseId { get; set; }

        public int UpdatedByUserId { get; set; } // obrigatório
    }

    public class EditTeamResponse
    {
        public int TeamId { get; set; }
        public string Name { get; set; }

        public EditTeamResponse(int teamId, string name)
        {
            TeamId = teamId;
            Name = name;
        }
    }
}
