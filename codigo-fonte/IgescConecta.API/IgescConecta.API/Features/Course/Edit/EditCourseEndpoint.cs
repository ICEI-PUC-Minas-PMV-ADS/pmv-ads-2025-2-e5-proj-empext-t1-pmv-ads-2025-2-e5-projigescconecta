using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.EditCourse
{
    [ApiAuthorize]
    [Route("/api/courses")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Courses")]
    public class EditCourseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public EditCourseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{courseId}", Name = "EditCourse")]
        public async Task<ActionResult<EditCourseResponse>> EditCourse(int courseId, [FromBody] EditCourseRequest request)
        {
            var result = await _mediator.Send(new EditCourseCommand
            {
                CourseId = courseId,
                Name = request.Name
            });

            var updateResponse = new EditCourseResponse(result.Value);

            return result.IsSuccess
                ? Ok(updateResponse)
                : BadRequest(result.Error);
        }
    }

    public class EditCourseRequest
    {
        public string Name { get; set; }
    }

    public class EditCourseResponse
    {
        public int CourseId { get; set; }

        public EditCourseResponse(int courseId)
        {
            CourseId = courseId;
        }
    }
}