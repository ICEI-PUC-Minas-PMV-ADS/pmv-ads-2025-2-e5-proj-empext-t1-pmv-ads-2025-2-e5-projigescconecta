using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.DeleteDonation
{
    [ApiController]
    [Route("api/donations")]
    public class DeleteDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var request = new DeleteDonationCommand { Id = id };

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return NoContent();
            }

            return BadRequest(result.Error);
        }
    }
}