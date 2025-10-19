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
                Neighborhood = request.Neighborhood,
                City = request.City,
                State = request.State,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                WebUrl = request.WebUrl,
                SocialMedia = request.SocialMedia,
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

        public string Neighborhood { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string WebUrl { get; set; }

        public string SocialMedia { get; set; }

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
