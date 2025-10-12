using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.InactivateCompany
{
    [ApiController]
    [Route("api/companies")]
    public class InactivateCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public InactivateCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{cnpj}")]
        public async Task<IActionResult> Delete(string cnpj)
        {
            var request = new InactivateCompanyCommand { CNPJ = cnpj };

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return NoContent();
            }

            return BadRequest(result.Error);
        }
    }
}