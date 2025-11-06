using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Restore
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    [Authorize(Roles = "Admin,Editor")]
    public class RestoreProjectProgramEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public RestoreProjectProgramEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPatch("{projectProgramId:int}/restore", Name = "RestoreProjectProgram")]
        public async Task<ActionResult<RestoreProjectProgramResponse>> Restore([FromRoute] int projectProgramId)
        {
            var result = await _mediator.Send(new RestoreProjectProgramCommand { ProjectProgramId = projectProgramId });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}

