using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectThemes.CreateProjectTheme
{
    [ApiAuthorize]
    [Route("/api/projectthemes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectThemes")]
    [Authorize(Roles = "Admin,Editor")]
    public class CreateProjectThemeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public CreateProjectThemeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost(Name = "CreateProjectTheme")]
        public async Task<ActionResult<CreateProjectThemeResponse>> Create([FromBody] CreateProjectThemeRequest request)
        {
            var result = await _mediator.Send(new CreateProjectThemeCommand { Name = request.Name });
            return result.IsSuccess
                ? Ok(new CreateProjectThemeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreateProjectThemeRequest
    {
        public string Name { get; set; }
    }

    public class CreateProjectThemeResponse
    {
        public int ProjectThemeId { get; set; }
        public CreateProjectThemeResponse(int id) => ProjectThemeId = id;
    }
}
