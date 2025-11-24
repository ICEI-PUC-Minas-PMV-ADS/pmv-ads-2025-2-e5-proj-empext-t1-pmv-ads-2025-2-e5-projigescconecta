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
                Name = request.Name,
                Notes = request.Notes
            });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            var createResponse = new CreateBeneficiaryResponse
            {
                Id = result.Value,
                Name = request.Name,
            };

            return Ok(createResponse);
        }
    }

    public class CreateBeneficiaryRequest
    {
        public string Name { get; set; }

        public string Notes { get; set; }
    }

    public class CreateBeneficiaryResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
