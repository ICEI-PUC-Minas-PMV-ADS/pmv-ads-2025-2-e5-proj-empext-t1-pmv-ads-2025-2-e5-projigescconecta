using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.ListCourse
{
    /* [ApiAuthorize] */
    [Route("/api/courses")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Courses")]
    public class ListCourseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListCourseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListCourse", Name = "ListCourse")]
        public async Task<ActionResult<ListCourseViewModel>> ListCourse([FromBody] ListCourseRequest request)

        {
            var result = await _mediator.Send(new ListCourseQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListCourseRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
