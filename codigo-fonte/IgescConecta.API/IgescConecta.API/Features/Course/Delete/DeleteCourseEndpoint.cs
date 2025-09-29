using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.DeleteCourse
{
    /* [ApiAuthorize] */
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

        [HttpDelete("DeleteCourse", Name = "DeleteCourse")]
        public async Task<ActionResult<DeleteCourseResponse>> DeleteCourse([FromBody] DeleteCourseRequest request)
        {
            var result = await _mediator.Send(new DeleteCourseCommand
            {
                CourseId = request.CourseId,
                DeactivatedByUserId = request.DeactivatedByUserId
            });

            return result.IsSuccess
                ? Ok(new DeleteCourseResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteCourseRequest
    {
        public int CourseId { get; set; }
        public int DeactivatedByUserId { get; set; } // Quem está desativando
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
