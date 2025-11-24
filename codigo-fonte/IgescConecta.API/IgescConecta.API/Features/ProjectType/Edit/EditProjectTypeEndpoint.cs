using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectTypes.EditProjectType
{
    [ApiAuthorize]
    [Route("/api/projecttypes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectTypes")]
    [Authorize(Roles = "Admin,Editor")]
    public class EditProjectTypeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public EditProjectTypeEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPut("{projectTypeId:int}", Name = "EditProjectType")]
        public async Task<ActionResult<EditProjectTypeResponse>> Edit(
            [FromRoute] int projectTypeId,
            [FromBody] EditProjectTypeRequest request)
        {
            var result = await _mediator.Send(new EditProjectTypeCommand
            {
                ProjectTypeId = projectTypeId,
                Name = request.Name
            });

            return result.IsSuccess
                ? Ok(new EditProjectTypeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class EditProjectTypeRequest
    {
        public string Name { get; set; }
    }

    public class EditProjectTypeResponse
    {
        public int ProjectTypeId { get; set; }
        public EditProjectTypeResponse(int id) => ProjectTypeId = id;
    }
}
