using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Edit
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    [Authorize(Roles = "Admin,Editor")]
    public class EditProjectProgramEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public EditProjectProgramEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{projectProgramId:int}", Name = "EditProjectProgram")]
        public async Task<ActionResult<EditProjectProgramResponse>> Edit(
            [FromRoute] int projectProgramId,
            [FromBody] EditProjectProgramRequest body)
        {
            var result = await _mediator.Send(new EditProjectProgramCommand
            {
                ProjectProgramId = projectProgramId,
                Body = body
            });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}
