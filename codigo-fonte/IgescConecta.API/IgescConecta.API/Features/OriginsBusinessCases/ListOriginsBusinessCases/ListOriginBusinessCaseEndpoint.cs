using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.OriginsBusinessCases.ListOriginsBusinessCases
{
    [ApiAuthorize]
    [Route("/api/origins-business-cases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "OriginsBusinessCases")]
    public class ListOriginBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListOriginBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListOriginBusinessCase", Name = "ListOriginBusinessCase")]
        public async Task<ActionResult<ListOriginBusinessCaseViewModel>> ListOriginBusinessCase(ListOriginBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new ListOriginBusinessCaseQuery(request.PageNumber, request.PageSize, request.Filters, request.BusinessCaseId));
            return Ok(result);
        }
    }

    public class ListOriginBusinessCaseRequest
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public List<Filter> Filters { get; set; } = [];

        public int BusinessCaseId { get; set; }
    }
}
