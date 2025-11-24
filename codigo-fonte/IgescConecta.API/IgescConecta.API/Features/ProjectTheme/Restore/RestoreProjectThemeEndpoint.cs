using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectThemes.RestoreProjectTheme
{
    [ApiAuthorize]
    [Route("/api/projectthemes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectThemes")]
    [Authorize(Roles = "Admin,Editor")]
    public class RestoreProjectThemeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public RestoreProjectThemeEndpoint(IMediator mediator) => _mediator = mediator;

        // PATCH: /api/projectthemes/{id}/restore
        [HttpPatch("{projectThemeId:int}/restore", Name = "RestoreProjectTheme")]
        public async Task<ActionResult<RestoreProjectThemeResponse>> Restore([FromRoute] int projectThemeId)
        {
            var result = await _mediator.Send(new RestoreProjectThemeCommand { ProjectThemeId = projectThemeId });

            return result.IsSuccess
                ? Ok(new RestoreProjectThemeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class RestoreProjectThemeResponse
    {
        public int ProjectThemeId { get; set; }
        public RestoreProjectThemeResponse(int id) => ProjectThemeId = id;
    }
}
