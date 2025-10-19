using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Beneficiares.UpdateBeneficiary
{
    [ApiAuthorize]
    [Route("/api/beneficiaries")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Beneficiaries")]
    public class UpdateBeneficiaryEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateBeneficiaryEndpoint(IMediator mediator) 
        { 
            _mediator = mediator;
        }

        [HttpPut("{beneficiaryId}", Name = "UpdateBeneficiary")]
        public async Task<ActionResult<UpdateBeneficiaryResponse>> UpdateBeneficiary(int beneficiaryId, [FromBody] UpdateBeneficiaryRequest request)
        {
            var result = await _mediator.Send(new UpdateBeneficiaryCommand
            {
                BeneficiaryId = beneficiaryId,
                Name = request.Name,
                Notes = request.Notes
            });

            var updateResponse = new UpdateBeneficiaryResponse
            {
                BeneficiaryId = beneficiaryId,
                Name = result.Value.Name,
                Notes = result.Value.Notes
            };

            return result.IsSuccess ? Ok(updateResponse) : BadRequest(result.Error);
        }
    }

    public class UpdateBeneficiaryRequest
    {
        public string Name { get; set; }

        public string Notes { get; set; }
    }

    public class UpdateBeneficiaryResponse
    {
        public int BeneficiaryId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }
    }
}
