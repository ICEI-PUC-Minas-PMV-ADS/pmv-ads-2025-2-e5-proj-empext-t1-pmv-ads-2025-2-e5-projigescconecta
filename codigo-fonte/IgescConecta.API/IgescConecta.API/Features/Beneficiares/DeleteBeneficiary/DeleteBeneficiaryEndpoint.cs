using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Beneficiares.DeleteBeneficiary
{
    [ApiAuthorize]
    [Route("/api/beneficiary")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Beneficiaries")]
    public class DeleteBeneficiaryEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteBeneficiaryEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{beneficiaryId}", Name = "DeleteBeneficiary")]
        public async Task<ActionResult> DeleteBeneficiary(int beneficiaryId)
        {
            var result = await _mediator.Send(new DeleteBeneficiaryCommand(beneficiaryId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}
