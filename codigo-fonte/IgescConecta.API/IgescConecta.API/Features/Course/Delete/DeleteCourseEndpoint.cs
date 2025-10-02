using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.DeleteCourse
{
    [ApiAuthorize]
    [Route("/api/courses")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Courses")]
    public class DeleteCourseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteCourseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{courseId}", Name = "DeleteCourse")]
        public async Task<ActionResult<DeleteCourseResponse>> DeleteCourse(int courseId)
        {
            var result = await _mediator.Send(new DeleteCourseCommand
            {
                CourseId = courseId
            });

            return result.IsSuccess
                ? Ok(new DeleteCourseResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteCourseResponse
    {
        public int CourseId { get; set; }

        public DeleteCourseResponse(int courseId)
        {
            CourseId = courseId;
        }
    }
}