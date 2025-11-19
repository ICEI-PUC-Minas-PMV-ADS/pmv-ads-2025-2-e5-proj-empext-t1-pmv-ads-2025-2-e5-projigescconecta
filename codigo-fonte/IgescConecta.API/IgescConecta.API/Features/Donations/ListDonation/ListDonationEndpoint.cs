using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Donations.ListDonation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.ListDonation
{
    [ApiAuthorize]
    [Route("api/donations")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Donation")]
    public class ListDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:int}", Name = "GetDonationById")]
        public async Task<IActionResult> Get(int id)
        {
            var query = new ListDonationQuery { Id = id };
            var result = await _mediator.Send(query);
            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            return NotFound(result.Error);
        }
    }
}