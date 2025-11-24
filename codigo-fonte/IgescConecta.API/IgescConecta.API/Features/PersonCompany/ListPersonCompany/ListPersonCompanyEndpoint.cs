using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonCompanies.ListPersonCompany
{
    [ApiAuthorize]
    [Route("/api/persons-company")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonCompany")]
    public class ListPersonCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListPersonCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{CompanyId}/search", Name = "ListPersonCompany")]
        public async Task<ActionResult<ListPersonCompanyViewModel>> ListPersonCompany(int CompanyId, [FromBody] PaginationRequest request)
        {
            var query = new ListPersonCompanyQuery(request.PageNumber, request.PageSize, request.Filters, CompanyId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}