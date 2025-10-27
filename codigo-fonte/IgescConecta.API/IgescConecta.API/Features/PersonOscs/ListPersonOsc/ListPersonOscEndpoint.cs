using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonOscs.ListPersonOsc
{
    [ApiAuthorize]
    [Route("/api/persons-osc")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonOsc")]
    public class ListPersonOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListPersonOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{OscId}/list", Name = "ListPersonOsc")]
        public async Task<ActionResult<ListPersonOscViewModel>> ListPersonOsc ([FromBody]ListPersonOscRequest request, int OscId)
        {
            var result = await _mediator.Send(new ListPersonOscQuery(request.PageNumber, request.PageSize, request.Filters, OscId));
            return Ok(result);
        }
    }

    public class ListPersonOscRequest
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public List<Filter> Filters { get; set; }
    }
}
