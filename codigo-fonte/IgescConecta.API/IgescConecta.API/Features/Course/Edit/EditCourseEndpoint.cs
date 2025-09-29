using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Courses.EditCourse
{
    /* [ApiAuthorize] */
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

        [HttpPut("EditCourse", Name = "EditCourse")]
        public async Task<ActionResult<EditCourseResponse>> EditCourse([FromBody] EditCourseRequest request)
        {
            var result = await _mediator.Send(new EditCourseCommand
            {
                CourseId = request.CourseId,
                Name = request.Name,
                UpdatedByUserId = request.UpdatedByUserId
            });

            return result.IsSuccess
                ? Ok(new EditCourseResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class EditCourseRequest
    {
        public int CourseId { get; set; }
        public string Name { get; set; }
        public int UpdatedByUserId { get; set; } // Id do usuário que está editando
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
