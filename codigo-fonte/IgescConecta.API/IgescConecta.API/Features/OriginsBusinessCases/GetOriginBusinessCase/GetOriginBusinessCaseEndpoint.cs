using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Validation;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.OriginsBusinessCases.GetOriginBusinessCase
{
    [ApiAuthorize]
    [Route("/api/origins-business-cases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "OriginsBusinessCases")]
    public class GetOriginBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetOriginBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{originBusinessCaseId}", Name = "GetOriginBusinessCase")]
        public async Task<ActionResult<GetOriginBusinessCaseResponse>> GetOriginBusinessCase(int originBusinessCaseId)
        {
            var result = await _mediator.Send(new GetOriginBusinessCaseQuery(originBusinessCaseId));

            var originBusinessCaseInfo = new GetOriginBusinessCaseResponse
            {
                OriginBusinessCaseId = originBusinessCaseId,
                Name = result.Value.Name,
                Oscs = result.Value?.Oscs?.Select(o => new GetOriginBusinessCaseOscResponse
                {
                    OscId = o.Id,
                    Name = o.Name
                }).ToList()
            };

            return result.IsSuccess ? Ok(originBusinessCaseInfo) : BadRequest(result.Error);
        }
    }

    public class GetOriginBusinessCaseResponse
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public List<GetOriginBusinessCaseOscResponse>? Oscs { get; set; }
    }

    public class GetOriginBusinessCaseOscResponse
    {
        public int OscId { get; set; }
        public string Name { get; set; }
    }
}
