using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Oscs.UpdateOsc
{
    [ApiAuthorize]
    [Route("/api/oscs")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Oscs")]
    public class UpdateOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{oscId}", Name = "UpdateOsc")]
        public async Task<ActionResult<UpdateOscResponse>> UpdateOsc(int oscId, [FromBody] UpdateOscRequest request)
        {
            var result = await _mediator.Send(new UpdateOscCommand
            {
                OscId = oscId,
                Name = request.Name,
                CorporateName = request.CorporateName,
                Objective = request.Objective,
                Address = request.Address,
                ZipCode = request.ZipCode,
                OscPrimaryDocumment = request.OscPrimaryDocumment,
                BeneficiaryIds = request.BeneficiaryIds,
                OriginBusinessCaseIds = request.OriginBusinessCaseIds
            });

            var updateResponse = new UpdateOscResponse
            {
                OscId = oscId,
                Name = result.Value.Name,
                CorporateName = result.Value.CorporateName,
                Objective = result.Value.Objective,
                Address = result.Value.Address,
                ZipCode = result.Value.ZipCode,
                OscPrimaryDocumment = result.Value.OscPrimaryDocumment,
                Beneficiaries = result.Value.Beneficiaries?.Select(b => new UpdateBeneficiaryInOscResponse
                {
                    BeneficiaryId = b.Id,
                    Name = b.Name
                }).ToList(),
                OriginsBusinessCases = result.Value.OriginsBusinessCases?.Select(o => new UpdateOriginBusinessCaseInOscResponse
                {
                    OriginBusinessCaseId = o.Id,
                    Name = o.Name
                }).ToList()
            };

            return result.IsSuccess ? Ok(updateResponse) : BadRequest(result.Error);
        }
    }

    public class UpdateOscRequest
    {
        public string? Name { get; set; }
        public string? CorporateName { get; set; }
        public string? Objective { get; set; }
        public string? Address { get; set; }
        public string? ZipCode { get; set; }
        public string? OscPrimaryDocumment { get; set; }
        public List<int>? BeneficiaryIds { get; set; }
        public List<int>? OriginBusinessCaseIds { get; set; }
    }

    public class UpdateOscResponse
    {
        public int OscId { get; set; }
        public string Name { get; set; }
        public string CorporateName { get; set; }
        public string Objective { get; set; }
        public string Address { get; set; }
        public string ZipCode { get; set; }
        public string? OscPrimaryDocumment { get; set; }
        public List<UpdateBeneficiaryInOscResponse>? Beneficiaries { get; set; }
        public List<UpdateOriginBusinessCaseInOscResponse>? OriginsBusinessCases { get; set; }
    }

    public class UpdateBeneficiaryInOscResponse
    {
        public int BeneficiaryId { get; set; }

        public string? Name { get; set; }
    }

    public class UpdateOriginBusinessCaseInOscResponse
    {
        public int OriginBusinessCaseId { get; set; }

        public string? Name { get; set; }
    }
}
