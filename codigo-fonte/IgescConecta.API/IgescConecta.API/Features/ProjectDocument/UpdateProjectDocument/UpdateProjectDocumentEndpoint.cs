using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.UpdateProjectDocument
{
    [ApiAuthorize]
    [Route("/api/projectdocuments")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectDocuments")]
    [Authorize(Roles = "Admin,Editor")]
    public class UpdateProjectDocumentEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateProjectDocumentEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{id:int}", Name = "UpdateProjectDocument")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<UpdateProjectDocumentResponse>> Update(
            [FromRoute] int id,
            [FromForm] UpdateProjectDocumentRequest body)
        {
            var result = await _mediator.Send(new UpdateProjectDocumentCommand
            {
                Id = id,
                Body = body
            });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}
