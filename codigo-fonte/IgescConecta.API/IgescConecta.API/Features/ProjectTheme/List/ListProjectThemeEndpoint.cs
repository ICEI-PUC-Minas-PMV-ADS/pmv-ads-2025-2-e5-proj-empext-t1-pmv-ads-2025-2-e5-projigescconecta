using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectThemes.ListProjectTheme
{
    [ApiAuthorize]
    [Route("/api/projectthemes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectThemes")]
    public class ListProjectThemeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public ListProjectThemeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("search", Name = "ListProjectTheme")]
        public async Task<ActionResult<ListProjectThemeViewModel>> List([FromBody] ListProjectThemeRequest request)
        {
            var result = await _mediator.Send(
                new ListProjectThemeQuery(request.PageNumber, request.PageSize, request.Filters, request.IncludeDeleted, request.OnlyDeleted)
            );
            return Ok(result);
        }

        [HttpGet("{id:int}", Name = "GetProjectThemeById")]
        public async Task<ActionResult<GetProjectThemeByIdViewModel>> GetById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetProjectThemeByIdQuery(id));
            if (result == null) return NotFound();
            return Ok(result);
        }
    }

    public class ListProjectThemeRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
        public bool IncludeDeleted { get; set; } = false;
        public bool OnlyDeleted { get; set; } = false;
    }
}
