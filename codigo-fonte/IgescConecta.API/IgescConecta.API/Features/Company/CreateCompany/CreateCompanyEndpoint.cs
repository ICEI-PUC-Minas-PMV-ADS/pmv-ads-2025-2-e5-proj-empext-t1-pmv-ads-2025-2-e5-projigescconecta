using IgescConecta.API.Features.Companies.CreateCompany;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.CreateCompany
{
    [ApiController]
    [Route("api/companies")]
    public class CreateCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateCompanyCommand request)
        {
            var result = await _mediator.Send(request);

            if (result.IsSuccess)
            {
                return CreatedAtRoute("GetCompanyByCnpj", new { cnpj = result.Value }, result.Value);
            }

            return BadRequest(result.Error);
        }
    }
}