using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.UpdateDonation
{
    [ApiController]
    [Route("api/donations")]
    public class UptadeDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UptadeDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Put([FromRoute] Guid id, [FromBody] UptadeDonationCommand request)
        {
            // Garante que o ID da rota e o ID do corpo coincidam (e popula o objeto)
            request.IDDoacao = id;

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return Ok(new { id = result.Value, message = "Doação atualizada com sucesso." });
            }

            return BadRequest(result.Error);
        }
    }
}