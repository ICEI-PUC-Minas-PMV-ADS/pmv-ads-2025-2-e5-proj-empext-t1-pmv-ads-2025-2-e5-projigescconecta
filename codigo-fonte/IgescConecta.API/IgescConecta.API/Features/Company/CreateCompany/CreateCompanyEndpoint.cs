using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Companies.CreateCompany;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Companies.CreateCompany
{
    [ApiAuthorize]
    [Route("/api/companies")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Company")]
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