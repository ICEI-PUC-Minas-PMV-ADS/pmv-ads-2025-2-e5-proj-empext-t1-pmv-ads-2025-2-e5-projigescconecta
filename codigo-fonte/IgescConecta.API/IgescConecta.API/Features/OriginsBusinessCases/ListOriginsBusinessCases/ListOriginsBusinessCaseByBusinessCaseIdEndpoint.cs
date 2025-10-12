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
    public class ListOriginsBusinessCaseByBusinessCaseIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListOriginsBusinessCaseByBusinessCaseIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListOriginsBusinessCaseByBusinessCaseId", Name = "ListOriginsBusinessCaseByBusinessCaseId")]
        public async Task<ActionResult<ListOriginsBusinessCaseByBusinessCaseIdViewModel>> ListOriginsBusinessCaseByBusinessCaseId(ListOriginsBusinessCaseByBusinessCaseIdRequest request)
        {
            var result = await _mediator.Send(new ListOriginsBusinessCaseByBusinessCaseIdQuery(request.PageNumber, request.PageSize, request.Filters, request.BusinessCaseId));
            return Ok(result);
        }
    }

    public class ListOriginsBusinessCaseByBusinessCaseIdRequest
    {
        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public List<Filter> Filters { get; set; } = [];

        public int BusinessCaseId { get; set; }
    }
}
