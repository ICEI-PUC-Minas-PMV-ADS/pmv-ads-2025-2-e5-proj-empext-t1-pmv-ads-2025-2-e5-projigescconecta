using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.ListCompanies
{
    [ApiController]
    [Route("api/companies")]
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
            var query = new ListCompaniesQuery(request.PageNumber, request.PageSize, request.Filters);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }

    public class ListCompaniesRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}