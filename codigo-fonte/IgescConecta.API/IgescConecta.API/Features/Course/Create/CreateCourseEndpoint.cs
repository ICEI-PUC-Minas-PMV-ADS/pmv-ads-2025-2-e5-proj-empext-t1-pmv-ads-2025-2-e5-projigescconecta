using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.CreateCourse
{
    [ApiAuthorize]
    [Route("/api/courses")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Courses")]
    public class CreateCourseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateCourseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateCourse", Name = "CreateCourse")]
        public async Task<ActionResult<CreateCourseResponse>> CreateCourse([FromBody] CreateCourseRequest request)
        {
            var result = await _mediator.Send(new CreateCourseCommand
            {
                Name = request.Name
            });

            return result.IsSuccess
                ? Ok(new CreateCourseResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreateCourseRequest
    {
        public string Name { get; set; }
    }

    public class CreateCourseResponse
    {
        public int CourseId { get; set; }

        public CreateCourseResponse(int courseId)
        {
            CourseId = courseId;
        }
    }
}