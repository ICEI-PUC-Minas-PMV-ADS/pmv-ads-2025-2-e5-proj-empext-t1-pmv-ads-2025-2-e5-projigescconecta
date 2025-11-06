using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectPrograms.Create
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    [Authorize(Roles = "Admin,Editor")]
    public class CreateProjectProgramEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateProjectProgramEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost(Name = "CreateProjectProgram")]
        public async Task<ActionResult<CreateProjectProgramResponse>> Create([FromBody] CreateProjectProgramRequest body)
        {
            var result = await _mediator.Send(new CreateProjectProgramCommand { Body = body });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}

