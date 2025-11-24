using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.ListCourse
{
    [ApiAuthorize]
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

        [HttpPost("search", Name = "ListCourse")]
        public async Task<ActionResult<ListCourseViewModel>> ListCourse([FromBody] ListCourseRequest request)
        {
            var result = await _mediator.Send(new ListCourseQuery(request.PageNumber, request.PageSize, request.Filters, request.StatusFilter));
            return Ok(result);
        }

        [HttpGet("{id:int}", Name = "GetCourseById")]
        public async Task<ActionResult<GetCourseByIdViewModel>> GetCourseById([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetCourseByIdQuery(id));

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }
    }

    public class ListCourseRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = new();
        public string? StatusFilter { get; set; }
    }
}