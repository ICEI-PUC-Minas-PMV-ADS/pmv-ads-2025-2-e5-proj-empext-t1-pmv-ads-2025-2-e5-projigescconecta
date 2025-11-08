using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonCompanies.CreatePersonCompany
{
    [ApiAuthorize]
    [Route("/api/persons-company")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonCompany")]
    public class CreatePersonCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreatePersonCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{CompanyId}/create", Name = "CreatePersonCompany")]
        public async Task<ActionResult<CreatePersonCompanyResponse>> CreatePersonCompany(int CompanyId, [FromBody] CreatePersonCompanyRequest request)
        {
            var result = await _mediator.Send(new CreatePersonCompanyCommand
            {
                CompanyId = CompanyId,
                PersonId = request.PersonId
            });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            var createPersonCompany = new CreatePersonCompanyResponse
            {
                Id = result.Value
            };

            return Ok(createPersonCompany);
        }
    }

    public class CreatePersonCompanyRequest
    {
        public int PersonId { get; set; }
    }

    public class CreatePersonCompanyResponse
    {
        public int Id { get; set; }
    }
}