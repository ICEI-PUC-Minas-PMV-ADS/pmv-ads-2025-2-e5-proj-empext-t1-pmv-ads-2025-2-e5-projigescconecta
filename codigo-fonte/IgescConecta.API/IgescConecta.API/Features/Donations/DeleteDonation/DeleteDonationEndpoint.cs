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

        [HttpDelete("{id:guid}")] // Usa DELETE para exclusão
        public async Task<IActionResult> Delete(Guid id)
        {
            var request = new DeleteDonationCommand { IDDoacao = id };

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                // Retorna 204 No Content para indicar sucesso
                return NoContent();
            }

            // Retorna 404 Not Found ou 400 Bad Request
            return NotFound(result.Error);
        }
    }
}