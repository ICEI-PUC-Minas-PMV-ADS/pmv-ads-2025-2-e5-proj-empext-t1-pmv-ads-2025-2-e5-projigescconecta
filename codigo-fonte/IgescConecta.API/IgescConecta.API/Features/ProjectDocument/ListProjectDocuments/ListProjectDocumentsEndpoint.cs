using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.ListProjectDocuments
{
    [ApiAuthorize]
    [Route("/api/projectdocuments")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "ProjectDocuments")]
    public class ListProjectDocumentsEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListProjectDocumentsEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet(Name = "ListProjectDocuments")]
        public async Task<ActionResult<ListProjectDocumentsResponse>> Get(
            [FromQuery] ListProjectDocumentsRequest query)
        {
            var result = await _mediator.Send(new ListProjectDocumentsQuery { Query = query });

            return result.IsSuccess
                ? Ok(result.Value)
                : BadRequest(result.Error);
        }
    }
}
