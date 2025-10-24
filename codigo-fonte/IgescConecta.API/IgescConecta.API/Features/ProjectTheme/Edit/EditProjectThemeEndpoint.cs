using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectThemes.EditProjectTheme
{
    [ApiAuthorize]
    [Route("/api/projectthemes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectThemes")]
    public class EditProjectThemeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public EditProjectThemeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPut("{projectThemeId:int}", Name = "EditProjectTheme")]
        public async Task<ActionResult<EditProjectThemeResponse>> Edit(
            [FromRoute] int projectThemeId,
            [FromBody] EditProjectThemeRequest request)
        {
            var result = await _mediator.Send(new EditProjectThemeCommand
            {
                ProjectThemeId = projectThemeId,
                Name = request.Name
            });

            return result.IsSuccess
                ? Ok(new EditProjectThemeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class EditProjectThemeRequest
    {
        public string Name { get; set; }
    }

    public class EditProjectThemeResponse
    {
        public int ProjectThemeId { get; set; }
        public EditProjectThemeResponse(int id) => ProjectThemeId = id;
    }
}
