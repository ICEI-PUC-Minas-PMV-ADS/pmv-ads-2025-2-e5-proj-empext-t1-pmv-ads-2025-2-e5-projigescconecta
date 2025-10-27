using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace IgescConecta.API.Features.PersonTeams.CreatePersonTeam
{
    [ApiAuthorize]
    [Route("/api/teams/{teamId}/personteams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonTeams")]
    public class CreatePersonTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreatePersonTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost(Name = "CreatePersonTeam")]
        public async Task<ActionResult<CreatePersonTeamResponse>> CreatePersonTeam(
            [FromRoute] int teamId,
            [FromBody] CreatePersonTeamRequest request)
        {
            var command = new CreatePersonTeamCommand
            {
                TeamId = teamId,
                PersonId = request.PersonId,
                OscId = request.OscId,
                MemberTypes = request.MemberTypes
            };

            var result = await _mediator.Send(command);

            return result.IsSuccess
                ? Ok(new CreatePersonTeamResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreatePersonTeamRequest
    {
        [Required(ErrorMessage = "O ID da pessoa é obrigatório.")]
        public int PersonId { get; set; }

        public int? OscId { get; set; }

        [Required(ErrorMessage = "Pelo menos um tipo de membro deve ser especificado.")]
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    public class CreatePersonTeamResponse
    {
        public int Id { get; set; }

        public CreatePersonTeamResponse(int personTeamId)
        {
            Id = personTeamId;
        }
    }
}