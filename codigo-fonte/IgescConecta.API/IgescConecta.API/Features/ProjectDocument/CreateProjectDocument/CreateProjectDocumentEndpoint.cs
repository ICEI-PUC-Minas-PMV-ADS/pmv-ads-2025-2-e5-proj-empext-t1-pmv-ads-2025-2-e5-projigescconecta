using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.CreateProjectDocument
{
    [ApiAuthorize]
    [Route("/api/projectdocuments")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectDocuments")]
    [Authorize(Roles = "Admin,Editor")]
    public class CreateProjectDocumentEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateProjectDocumentEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost(Name = "CreateProjectDocument")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<CreateProjectDocumentResponse>> Create(
            [FromForm] CreateProjectDocumentRequest request)
        {
            var result = await _mediator.Send(new CreateProjectDocumentCommand { Body = request });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}
