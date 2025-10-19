using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.BusinessCases.UpdateBusinessCase
{
    [ApiAuthorize]
    [Route("/api/businesscases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "BusinessCases")]
    public class UpdateBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{businessCaseId}", Name = "UpdateBusinessCase")]
        public async Task<ActionResult<UpdateBusinessCaseResponse>> UpdateBusinessCase(int businessCaseId, [FromBody] UpdateBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new UpdateBusinessCaseCommand
            {
                BusinessCaseId = businessCaseId,
                Name = request.Name,
                OriginsBusinessCasesIds = request.OriginsBusinessCasesIds
            });

            var updateResponse = new UpdateBusinessCaseResponse
            {
                BusinessCaseId = businessCaseId,
                Name = result.Value.Name,
                OriginsBusinessCases = result.Value.Origins?.Select(o => new UpdateOriginBusinessCaseInBusinessCaseResponse
                {
                    OriginBusinessCaseId = o.Id,
                    Name = o.Name
                }).ToList()
            };

            return result.IsSuccess ? Ok(updateResponse) : BadRequest(result.Error);
        }
    }

    public class UpdateBusinessCaseRequest
    {
        public string? Name { get; set; }

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    public class UpdateBusinessCaseResponse
    {
        public int BusinessCaseId { get; set; }

        public string Name { get; set; }

        public List<UpdateOriginBusinessCaseInBusinessCaseResponse>? OriginsBusinessCases { get; set; }
    }

    public class UpdateOriginBusinessCaseInBusinessCaseResponse
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }
    }
}
