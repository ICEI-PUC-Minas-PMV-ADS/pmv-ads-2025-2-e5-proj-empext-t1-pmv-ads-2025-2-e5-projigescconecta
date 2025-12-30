using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Validation;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.ProjectDocument.DeleteProjectDocument
{
    [ApiAuthorize]
    [Route("/api/projectdocuments")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectDocuments")]
    [Authorize(Roles = "Admin,Editor")]
    public class DeleteProjectDocumentEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteProjectDocumentEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{id:int}", Name = "DeleteProjectDocument")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mediator.Send(new DeleteProjectDocumentCommand { Id = id });

            return result.IsSuccess
                ? NoContent()
                : BadRequest(result.Error);
        }
    }
}
