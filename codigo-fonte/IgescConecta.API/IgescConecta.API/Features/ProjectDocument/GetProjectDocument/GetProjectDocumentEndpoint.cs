using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.GetProjectDocument
{
    [ApiAuthorize]
    [Route("/api/projectdocuments")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectDocuments")]
    [Authorize(Roles = "Admin,Editor")]
    public class GetProjectDocumentEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetProjectDocumentEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:int}", Name = "GetProjectDocument")]
        public async Task<ActionResult<GetProjectDocumentResponse>> Get([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetProjectDocumentQuery { Id = id });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }

        [HttpGet("{id:int}/download", Name = "DownloadProjectDocument")]
        public async Task<IActionResult> Download([FromRoute] int id)
        {
            var result = await _mediator.Send(new GetProjectDocumentFileQuery { Id = id });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            var file = result.Value;
            return File(file.FileData, file.ContentType, file.FileName);
        }
    }
}
