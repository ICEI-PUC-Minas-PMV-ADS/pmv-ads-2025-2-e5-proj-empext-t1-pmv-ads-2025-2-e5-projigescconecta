using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.BusinessCases.GetBusinessCase
{
    [ApiAuthorize]
    [Route("/api/businesscases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "BusinessCases")]
    public class GetBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{businessCaseId}", Name = "GetBusinessCase")]
        public async Task<ActionResult<GetBusinessCaseResponse>> GetBusinessCase(int businessCaseId)
        {
            var result = await _mediator.Send(new GetBusinessCaseQuery(businessCaseId));

            var businessCaseInfo = new GetBusinessCaseResponse
            {
                BusinessCaseId = businessCaseId,
                Name = result.Value.Name,
                Origins = result.Value?.Origins.Select(o => new GetBusinessCaseOriginResponse
                {
                    OriginBusinessCaseId = o.Id,
                    Name = o.Name
                }).ToList()
            };

            return result.IsSuccess ? Ok(businessCaseInfo) : BadRequest(result.Error);
        }
    }

    public class GetBusinessCaseResponse
    {
        public int BusinessCaseId { get; set; }

        public string Name { get; set; }

        public List<GetBusinessCaseOriginResponse> Origins { get; set; } = [];
    }

    public class GetBusinessCaseOriginResponse
    {
        public int OriginBusinessCaseId { get; set; }
        public string Name { get; set; }
    }
}
