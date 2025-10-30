using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectPrograms.ListProjectPrograms
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    public class ListProjectProgramEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListProjectProgramEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("search", Name = "ListProjectProgram")]
        public async Task<ActionResult<ListProjectProgramViewModel>> List([FromBody] ListProjectProgramRequest request)
        {
            var result = await _mediator.Send(new ListProjectProgramQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListProjectProgramRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
    }
}
