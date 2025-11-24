using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Companies.ListCompany;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.ListCompany
{
    [ApiAuthorize]
    [Route("/api/companies")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Company")]
    public class ListCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public ListCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{cnpj}", Name = "GetCompanyByCnpj")]
        public async Task<IActionResult> Get(string cnpj)
        {
            var query = new ListCompanyQuery { CNPJ = cnpj };
            var result = await _mediator.Send(query);
            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }
            return NotFound(result.Error);
        }
    }
}