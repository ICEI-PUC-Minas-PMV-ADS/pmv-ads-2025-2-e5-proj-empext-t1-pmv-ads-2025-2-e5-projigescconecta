using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.ListCompanies
{
    [ApiAuthorize]
    [Route("/api/companies")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Company")]
    public class ListCompaniesEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListCompaniesEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("search")]
        public async Task<ActionResult<ListCompaniesViewModel>> Search(ListCompaniesRequest request)
        {
            var query = new ListCompaniesQuery(request.PageNumber, request.PageSize, request.Filters, request.StatusFilter);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }

    public class ListCompaniesRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
        public string? StatusFilter { get; set; }
    }
}