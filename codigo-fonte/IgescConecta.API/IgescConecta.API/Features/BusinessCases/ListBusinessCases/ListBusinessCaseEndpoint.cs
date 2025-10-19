using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.BusinessCases.ListBusinessCases
{
    [ApiAuthorize]
    [Route("/api/businesscase")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "BusinessCases")]
    public class ListBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListBusinessCase", Name = "ListBusinessCase")]
        public async Task<ActionResult<ListBusinessCaseViewModel>> ListBusinessCases(ListBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new ListBusinessCaseQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListBusinessCaseRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
