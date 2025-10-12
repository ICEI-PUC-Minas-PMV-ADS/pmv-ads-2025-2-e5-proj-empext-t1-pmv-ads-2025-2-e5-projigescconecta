using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Empresas.CreateEmpresa
{
    [ApiController]
    [Route("api/empresas")]
    public class CreateEmpresaEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateEmpresaEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateEmpresaCommand request)
        {
            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                // Sucesso: Retorna 201 Created com o CNPJ no corpo
                return CreatedAtAction("Get", "ListEmpresa", new { cnpj = result.Value }, new { cnpj = result.Value });
            }

            // Falha: Retorna 400 Bad Request
            return BadRequest(result.Error);
        }
    }
}