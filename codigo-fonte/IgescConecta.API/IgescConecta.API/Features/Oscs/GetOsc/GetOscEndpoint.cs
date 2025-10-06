using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Oscs.GetOsc
{
    [ApiAuthorize]
    [Route("/api/oscs")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Oscs")]
    public class GetOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{oscId}", Name = "GetOsc")]
        public async Task<ActionResult<GetOscResponse>> GetOsc(int oscId)
        {
            var result = await _mediator.Send(new GetOscQuery(oscId));
            var oscInfo = new GetOscResponse
            {
                OscId = oscId,
                Name = result.Value.Name,
                CorporateName = result.Value.CorporateName,
                Objective = result.Value.Objective,
                Address = result.Value.Address,
                OscPrimaryDocumment = result.Value?.OscPrimaryDocumment,
                ZipCode = result.Value.ZipCode,

                Beneficiaries = result.Value?.Beneficiaries.Select(b => new GetOscBeneficiaryResponse
                {
                    BeneficiaryId = b.Id,
                    Name = b.Name
                }).ToList(),

                OriginsBusinessCases = result.Value?.OriginsBusinessCases.Select(o => new GetOscOriginBusinessCaseResponse
                {
                    OriginBusinessCaseId = o.Id,
                    Name = o.Name
                }).ToList()
            };
            return result.IsSuccess ? Ok(oscInfo) : BadRequest(result.Error);
        }
    }

    public class GetOscResponse
    {
        public int OscId { get; set; }

        public string Name { get; set; }

        public string CorporateName { get; set; }

        public string Objective { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string? OscPrimaryDocumment { get; set; }

        public List<GetOscBeneficiaryResponse> Beneficiaries { get; set; } = [];

        public List<GetOscOriginBusinessCaseResponse> OriginsBusinessCases { get; set; } = [];
    }

    public class GetOscBeneficiaryResponse
    {
        public int BeneficiaryId { get; set; }

        public string Name { get; set; }
    }

    public class GetOscOriginBusinessCaseResponse
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }
    }

}
