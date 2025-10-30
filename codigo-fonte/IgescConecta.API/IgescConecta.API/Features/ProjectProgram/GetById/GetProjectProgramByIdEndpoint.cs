using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.GetById
{
    [ApiAuthorize]
    [Route("/api/projectprograms")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectPrograms")]
    public class GetProjectProgramByIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetProjectProgramByIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:int}", Name = "GetProjectProgramById")]
        public async Task<ActionResult<GetProjectProgramByIdViewModel>> Get([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetProjectProgramByIdQuery(id));
            if (result is null) return NotFound();
            return Ok(result);
        }
    }
}

