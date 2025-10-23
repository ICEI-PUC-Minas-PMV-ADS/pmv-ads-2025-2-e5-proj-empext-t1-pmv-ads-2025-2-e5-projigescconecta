using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectThemes.DeleteProjectTheme
{
    [ApiAuthorize]
    [Route("/api/projectthemes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectThemes")]
    public class DeleteProjectThemeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public DeleteProjectThemeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpDelete("{projectThemeId:int}", Name = "DeleteProjectTheme")]
        public async Task<ActionResult<DeleteProjectThemeResponse>> Delete([FromRoute] int projectThemeId)
        {
            var result = await _mediator.Send(new DeleteProjectThemeCommand { ProjectThemeId = projectThemeId });

            return result.IsSuccess
                ? Ok(new DeleteProjectThemeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteProjectThemeResponse
    {
        public int ProjectThemeId { get; set; }
        public DeleteProjectThemeResponse(int id) => ProjectThemeId = id;
    }
}
