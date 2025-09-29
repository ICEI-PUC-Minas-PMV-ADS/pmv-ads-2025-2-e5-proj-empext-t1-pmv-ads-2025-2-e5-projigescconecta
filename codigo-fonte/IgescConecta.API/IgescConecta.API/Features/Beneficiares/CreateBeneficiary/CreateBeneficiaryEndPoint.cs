using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Beneficiares.CreateBeneficiary
{
    [ApiAuthorize]
    [Route("/api/beneficiary")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Beneficiaries")]
    public class CreateBeneficiaryEndPoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateBeneficiaryEndPoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateBeneficiary", Name = "CreateBeneficiary")]
        public async Task<ActionResult<CreateBeneficiaryResponse>> CreateBeneficiary([FromBody] CreateBeneficiaryRequest request)
        {
            var result = await _mediator.Send(new CreateBeneficiaryCommand
            {
                Name = request.Name
            });
            return result.IsSuccess ? Ok(new CreateBeneficiaryResponse(result.Value)) : BadRequest(result.Error);
        }
    }

    public class CreateBeneficiaryRequest
    {
        public string Name { get; set; }
    }

    public class CreateBeneficiaryResponse
    {
        public int BeneficiaryId { get; set; }
        public CreateBeneficiaryResponse(int beneficiaryId)
        {
            BeneficiaryId = beneficiaryId;
        }
    }
}
