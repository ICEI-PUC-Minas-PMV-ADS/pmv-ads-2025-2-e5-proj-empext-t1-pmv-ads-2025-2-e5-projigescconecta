using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Empresas.InativarEmpresa
{
    [ApiController]
    [Route("api/empresas")]
    public class InativarEmpresaEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public InativarEmpresaEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{cnpj}")]
        public async Task<IActionResult> Delete(string cnpj)
        {
            var request = new InativarEmpresaCommand { CNPJ = cnpj };

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                // Retorna 204 No Content para indicar sucesso na exclusão (lógica)
                return NoContent();
            }

            return BadRequest(result.Error);
        }
    }
}