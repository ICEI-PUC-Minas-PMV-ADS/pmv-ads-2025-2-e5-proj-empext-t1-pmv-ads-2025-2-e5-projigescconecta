using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectTypes.CreateProjectType
{
    [ApiAuthorize]
    [Route("/api/projecttypes")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectTypes")]
    public class CreateProjectTypeEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateProjectTypeEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost(Name = "CreateProjectType")]
        public async Task<ActionResult<CreateProjectTypeResponse>> Create([FromBody] CreateProjectTypeRequest request)
        {
            var result = await _mediator.Send(new CreateProjectTypeCommand
            {
                Name = request.Name
            });

            return result.IsSuccess
                ? Ok(new CreateProjectTypeResponse(result.Value))
                : BadRequest(result.Error);
        }
    }

    public class CreateProjectTypeRequest
    {
        public string Name { get; set; }
    }

    public class CreateProjectTypeResponse
    {
        public int ProjectTypeId { get; set; }

        public CreateProjectTypeResponse(int id)
        {
            ProjectTypeId = id;
        }
    }
}
