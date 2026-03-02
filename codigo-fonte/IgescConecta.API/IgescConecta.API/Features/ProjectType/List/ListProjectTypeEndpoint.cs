using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectTypes.ListProjectType
{
    [ApiAuthorize]
    [Route("/api/projecttypes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectTypes")]
    public class ListProjectTypeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public ListProjectTypeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("search", Name = "ListProjectType")]
        public async Task<ActionResult<ListProjectTypeViewModel>> List([FromBody] ListProjectTypeRequest request)
        {
            var result = await _mediator.Send(
                new ListProjectTypeQuery(request.PageNumber, request.PageSize, request.Filters, request.StatusFilter)
            );
            return Ok(result);
        }

        [HttpGet("{id:int}", Name = "GetProjectTypeById")]
        public async Task<ActionResult<GetProjectTypeByIdViewModel>> GetById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetProjectTypeByIdQuery(id));
            if (result == null) return NotFound();
            return Ok(result);
        }
    }

    public class ListProjectTypeRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
        public string? StatusFilter { get; set; }
    }
}
