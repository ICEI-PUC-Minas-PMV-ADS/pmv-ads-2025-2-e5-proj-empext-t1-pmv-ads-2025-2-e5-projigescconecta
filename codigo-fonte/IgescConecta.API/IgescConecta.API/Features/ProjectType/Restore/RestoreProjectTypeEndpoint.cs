using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectTypes.RestoreProjectType
{
    [ApiAuthorize]
    [Route("/api/projecttypes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectTypes")]
    public class RestoreProjectTypeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public RestoreProjectTypeEndpoint(IMediator mediator) => _mediator = mediator;

        // PATCH: /api/projecttypes/{id}/restore
        [HttpPatch("{projectTypeId:int}/restore", Name = "RestoreProjectType")]
        public async Task<ActionResult<RestoreProjectTypeResponse>> Restore([FromRoute] int projectTypeId)
        {
            var result = await _mediator.Send(new RestoreProjectTypeCommand { ProjectTypeId = projectTypeId });

            return result.IsSuccess
                ? Ok(new RestoreProjectTypeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class RestoreProjectTypeResponse
    {
        public int ProjectTypeId { get; set; }
        public RestoreProjectTypeResponse(int id) => ProjectTypeId = id;
    }
}
