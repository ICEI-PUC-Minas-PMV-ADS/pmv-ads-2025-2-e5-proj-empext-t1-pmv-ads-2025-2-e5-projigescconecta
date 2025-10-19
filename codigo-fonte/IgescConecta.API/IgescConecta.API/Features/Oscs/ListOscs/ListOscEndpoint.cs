using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Oscs.ListOscs
{
    [ApiAuthorize]
    [Route("/api/osc")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Oscs")]
    public class ListOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListOsc", Name = "ListOsc")]
        public async Task<ActionResult<ListOscViewModel>> ListOscs(ListOscRequest request)
        {
            var result = await _mediator.Send(new ListOscQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListOscRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
