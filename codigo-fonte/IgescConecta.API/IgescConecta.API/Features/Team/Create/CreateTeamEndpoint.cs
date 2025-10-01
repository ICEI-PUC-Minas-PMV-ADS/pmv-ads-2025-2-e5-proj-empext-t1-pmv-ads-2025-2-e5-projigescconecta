// CreateTeamEndpoint.cs
using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
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
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Time = request.Time,
                CourseId = request.CourseId,
                CreatedByUserId = request.CreatedByUserId
            });

            return result.IsSuccess
                ? Ok(new CreateTeamResponse(result.Value.Id, result.Value.Name, result.Value.CreatedBy))
                : BadRequest(result.Error);
        }
    }

    public class CreateTeamRequest
    {
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Time { get; set; }
        public int CourseId { get; set; }
        public int CreatedByUserId { get; set; }
    }

    public class CreateTeamResponse
    {
        public int TeamId { get; set; }
        public string Name { get; set; }
        public int CreatedBy { get; set; }

        public CreateTeamResponse(int teamId, string name, int createdBy)
        {
            TeamId = teamId;
            Name = name;
            CreatedBy = createdBy;
        }
    }
}
