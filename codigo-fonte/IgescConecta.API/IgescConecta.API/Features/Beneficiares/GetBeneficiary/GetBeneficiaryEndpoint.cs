using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Beneficiares.GetBeneficiary
{
    [ApiAuthorize]
    [Route("/api/beneficiaries")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Beneficiaries")]
    public class GetBeneficiaryEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetBeneficiaryEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{beneficiaryId}", Name = "GetBeneficiary")]
        public async Task<ActionResult<GetBeneficiaryResponse>> GetBeneficiary(int beneficiaryId)
        {
            var result = await _mediator.Send(new GetBeneficiaryQuery(beneficiaryId));

            var beneficiaryInfo = new GetBeneficiaryResponse
            {
                BeneficiaryId = beneficiaryId,
                Name = result.Value?.Name,
                Notes = result.Value?.Notes,
                Oscs = result.Value?.Oscs.Select(o => new GetBeneficiaryOscResponse
                {
                    OscId = o.Id,
                    Name = o.Name,
                    CorporateName = o.CorporateName
                }).ToList()
            };

            return result.IsSuccess ? Ok(beneficiaryInfo) : BadRequest(result.Error);
        }

        public class GetBeneficiaryResponse
        {
            public int BeneficiaryId { get; set; }

            public string Name { get; set; }

            public string Notes { get; set; }

            public List<GetBeneficiaryOscResponse> Oscs { get; set; } = new();
        }

        public class GetBeneficiaryOscResponse
        {
            public int OscId { get; set; }

            public string Name { get; set; }

            public string CorporateName { get; set; }
        }
    }
}
