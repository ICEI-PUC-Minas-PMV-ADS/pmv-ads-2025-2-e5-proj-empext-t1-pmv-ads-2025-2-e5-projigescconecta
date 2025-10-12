using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Donations.ListDonation
{
    [ApiController]
    [Route("api/donations")]
    public class ListDonationEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListDonationEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{id:guid}")] // Rota para buscar uma �nica doa��o por ID
        public async Task<IActionResult> Get(Guid id)
        {
            var query = new ListDonationQuery { IDDoacao = id };
            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }

            return NotFound(result.Error);
        }

        // TODO: Voc� pode adicionar um [HttpGet] sem rota para listar todas (com pagina��o)
    }
}