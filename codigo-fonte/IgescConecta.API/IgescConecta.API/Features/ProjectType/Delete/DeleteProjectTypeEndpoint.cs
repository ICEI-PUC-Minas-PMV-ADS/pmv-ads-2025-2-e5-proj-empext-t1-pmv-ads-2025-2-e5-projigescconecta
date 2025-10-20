using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectTypes.DeleteProjectType
{
    [ApiAuthorize]
    [Route("/api/projecttypes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectTypes")]
    public class DeleteProjectTypeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteProjectTypeEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{projectTypeId:int}", Name = "DeleteProjectType")]
        public async Task<ActionResult<DeleteProjectTypeResponse>> Delete(int projectTypeId)
        {
            var result = await _mediator.Send(new DeleteProjectTypeCommand
            {
                ProjectTypeId = projectTypeId
            });

            return result.IsSuccess
                ? Ok(new DeleteProjectTypeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class DeleteProjectTypeResponse
    {
        public int ProjectTypeId { get; set; }

        public DeleteProjectTypeResponse(int id)
        {
            ProjectTypeId = id;
        }
    }
}
