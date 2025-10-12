using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Empresas.UpdateEmpresa
{
    [ApiController]
    [Route("api/empresas")]
    public class UpdateEmpresaEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateEmpresaEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{cnpj}")]
        public async Task<IActionResult> Put([FromRoute] string cnpj, [FromBody] UpdateEmpresaCommand request)
        {
            // Garante que o CNPJ da rota e o CNPJ do corpo coincidam (e popula o objeto)
            request.CNPJ = cnpj;

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                // Retorna 200 OK
                return Ok(new { cnpj = result.Value, message = "Empresa atualizada com sucesso." });
            }

            return BadRequest(result.Error);
        }
    }
}