using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Donations.CreateDonation;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.CreateDonation
{
    [ApiAuthorize]
    [Route("api/donations")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Donation")]
    public class CreateDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateDonationCommand request)
        {
            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return CreatedAtRoute("GetDonationById", new { id = result.Value }, result.Value);
            }

            return BadRequest(result.Error);
        }
    }
}