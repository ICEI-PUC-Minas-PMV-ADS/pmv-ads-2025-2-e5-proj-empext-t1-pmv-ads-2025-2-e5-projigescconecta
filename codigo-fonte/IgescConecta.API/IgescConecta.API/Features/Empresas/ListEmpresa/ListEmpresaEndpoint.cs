using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Empresas.ListEmpresa
{
    [ApiController]
    [Route("api/empresas")]
    public class ListEmpresaEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListEmpresaEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{cnpj}")] // Busca uma �nica empresa
        public async Task<IActionResult> Get(string cnpj)
        {
            var query = new ListEmpresaQuery { CNPJ = cnpj };
            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }

            // Retorna 404 (Not Found) se a empresa n�o for encontrada ou inativa
            return NotFound(result.Error);
        }

        // TODO: Voc� pode adicionar um [HttpGet] sem rota para listar todas (com pagina��o)
    }
}