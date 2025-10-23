using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace IgescConecta.API.Features.PersonTeams.EditPersonTeam
{
    [ApiAuthorize]
    [Route("/api/personteams")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonTeams")]
    public class EditPersonTeamEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public EditPersonTeamEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{id}", Name = "EditPersonTeam")]
        public async Task<ActionResult<EditPersonTeamResponse>> EditPersonTeam(
            [FromRoute] int id,
            [FromBody] EditPersonTeamRequest request)
        {
            var command = new EditPersonTeamCommand
            {
                Id = id,
                MemberTypes = request.MemberTypes
            };

            var result = await _mediator.Send(command);

            return result.IsSuccess
                ? Ok(new EditPersonTeamResponse(true))
                : BadRequest(result.Error);
        }
    }

    public class EditPersonTeamRequest
    {
        [Required(ErrorMessage = "Pelo menos um tipo de membro deve ser especificado.")]
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    public class EditPersonTeamResponse
    {
        public bool Success { get; set; }

        public EditPersonTeamResponse(bool success)
        {
            Success = success;
        }
    }
}