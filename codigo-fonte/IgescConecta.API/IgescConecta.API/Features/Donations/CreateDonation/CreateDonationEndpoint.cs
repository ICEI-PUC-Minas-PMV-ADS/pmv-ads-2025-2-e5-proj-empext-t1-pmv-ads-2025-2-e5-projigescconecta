using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.CreateDonation
{
    [ApiController]
    [Route("api/donations")]
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
                return CreatedAtAction("Get", "ListDonation", new { id = result.Value }, new { id = result.Value });
            }

            return BadRequest(result.Error);
        }
    }
}