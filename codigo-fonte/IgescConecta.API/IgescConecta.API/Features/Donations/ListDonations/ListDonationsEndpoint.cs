using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.ListDonations
{
    [ApiAuthorize]
    [Route("api/donations")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Donation")]
    public class ListDonationsEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListDonationsEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("search")]
        public async Task<ActionResult<ListDonationsViewModel>> Search(ListDonationsRequest request)
        {
            var query = new ListDonationsQuery(request.PageNumber, request.PageSize, request.Filters, request.StatusFilter);
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }

    public class ListDonationsRequest
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public List<Filter> Filters { get; set; } = new();
        public string? StatusFilter { get; set; }
    }
}