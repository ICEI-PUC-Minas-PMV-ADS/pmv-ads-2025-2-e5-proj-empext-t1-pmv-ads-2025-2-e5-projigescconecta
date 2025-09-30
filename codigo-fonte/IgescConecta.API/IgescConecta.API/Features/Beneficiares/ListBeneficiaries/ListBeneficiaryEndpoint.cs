using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Beneficiares.ListBeneficiaries
{
    [ApiAuthorize]
    [Route("/api/beneficiary")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Beneficiaries")]
    public class ListBeneficiaryEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListBeneficiaryEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("ListBeneficiary", Name = "ListBeneficiary")]
        public async Task<ActionResult<ListBeneficiaryViewModel>> ListBeneficiaries(ListBeneficiaryRequest request)
        {
            var result = await _mediator.Send(new ListBeneficiaryQuery(request.PageNumber, request.PageSize, request.Filters));
            return Ok(result);
        }
    }

    public class ListBeneficiaryRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
    }
}
