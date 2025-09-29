using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Oscs.CreateOsc
{
    [ApiAuthorize]
    [Route("/api/osc")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Oscs")]
    public class CreateOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateOsc", Name = "CreateOsc")]
        public async Task<ActionResult<CreateOscResponse>> CreateOsc([FromBody] CreateOscRequest request)
        {
            var result = await _mediator.Send(new CreateOscCommand
            {
                Name = request.Name,
                OscPrimaryDocumment = request.OscPrimaryDocumment,
                Address = request.Address,
                CorporateName = request.CorporateName,
                Objective = request.Objective,
                ZipCode = request.ZipCode,
                OriginsBusinessCasesIds = request.OriginsBusinessCasesIds,
                BeneficiariesIds = request.BeneficiariesIds
            });
            return result.IsSuccess ? Ok(new CreateOscResponse(result.Value)) : BadRequest(result.Error);
        }
    }

    public class CreateOscRequest
    {
        public string Name { get; set; }

        public string Objective { get; set; }

        public string CorporateName { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string? OscPrimaryDocumment { get; set; }

        public List<int> BeneficiariesIds { get; set; } = [];

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    public class CreateOscResponse
    {
        public int OscId { get; set; }

        public CreateOscResponse(int oscId)
        {
            OscId = oscId;
        }
    }
}
