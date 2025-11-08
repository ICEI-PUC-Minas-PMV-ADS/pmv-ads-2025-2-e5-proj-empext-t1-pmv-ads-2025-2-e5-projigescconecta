using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.UpdateDonation
{
    [ApiAuthorize]
    [Route("api/donations")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Donation")]
    public class UpdateDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] UpdateDonationCommand request)
        {
            request.Id = id;

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return Ok(new { id = result.Value, message = "Donation updated successfully." });
            }

            return BadRequest(result.Error);
        }
    }
}