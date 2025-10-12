using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.ListCompany
{
    [ApiController]
    [Route("api/companies")]
    public class ListCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{cnpj}")]
        public async Task<IActionResult> Get(string cnpj)
        {
            var query = new ListCompanyQuery { CNPJ = cnpj };

            var result = await _mediator.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }

            return BadRequest(result.Error);
        }
    }
}