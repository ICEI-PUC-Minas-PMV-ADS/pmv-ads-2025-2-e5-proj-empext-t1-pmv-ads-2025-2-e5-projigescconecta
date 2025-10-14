using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.UpdateCompany
{
    [ApiController]
    [Route("api/companies")]
    public class UpdateCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{cnpj}")]
        public async Task<IActionResult> Put([FromRoute] string cnpj, [FromBody] UpdateCompanyCommand request)
        {
            request.CNPJ = cnpj;

            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return Ok(new { cnpj = result.Value, message = "Company updated successfully." });
            }

            return BadRequest(result.Error);
        }
    }
}