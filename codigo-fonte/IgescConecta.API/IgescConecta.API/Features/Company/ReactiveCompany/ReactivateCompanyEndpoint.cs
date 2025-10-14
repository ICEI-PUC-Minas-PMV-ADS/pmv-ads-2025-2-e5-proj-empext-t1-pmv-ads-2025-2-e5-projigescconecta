using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.ReactivateCompany
{
    [ApiController]
    [Route("api/companies")]
    public class ReactivateCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ReactivateCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPatch("{cnpj}/activate")]
        public async Task<IActionResult> Reactivate(string cnpj)
        {
            var command = new ReactivateCompanyCommand { CNPJ = cnpj };

            var result = await _mediator.Send(command);

            if (result.IsSuccess)
            {
                return NoContent();
            }

            return BadRequest(result.Error);
        }
    }
}