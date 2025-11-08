using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonCompanies.DeletePersonCompany
{
    [ApiAuthorize]
    [Route("/api/persons-company")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonCompany")]
    public class DeletePersonCompanyEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeletePersonCompanyEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{id:int}", Name = "DeletePersonCompany")]
        public async Task<IActionResult> DeletePersonCompany(int id)
        {
            var result = await _mediator.Send(new DeletePersonCompanyCommand { Id = id });

            if (result.IsSuccess)
            {
                return Ok(new { id = result.Value, message = "Vínculo Pessoa-Empresa excluído com sucesso." });
            }

            return NotFound(result.Error);
        }
    }
}