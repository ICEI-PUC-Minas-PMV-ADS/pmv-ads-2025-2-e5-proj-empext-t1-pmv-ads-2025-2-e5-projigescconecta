using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Delete
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    [Authorize(Roles = "Admin,Editor")]
    public class DeleteProjectProgramEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteProjectProgramEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{projectProgramId:int}", Name = "DeleteProjectProgram")]
        public async Task<ActionResult<DeleteProjectProgramResponse>> Delete([FromRoute] int projectProgramId)
        {
            var result = await _mediator.Send(new DeleteProjectProgramCommand { ProjectProgramId = projectProgramId });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}
