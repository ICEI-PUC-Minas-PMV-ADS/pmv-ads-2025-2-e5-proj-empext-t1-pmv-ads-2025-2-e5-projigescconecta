using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.OriginsBusinessCases.UpdateOriginBusinessCase
{
    [ApiAuthorize]
    [Route("/api/origins-business-cases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "OriginsBusinessCases")]
    public class UpdateOriginBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateOriginBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPut("{originBusinessCaseId}", Name = "UpdateOriginBusinessCase")]
        public async Task<ActionResult<UpdateOriginBusinessCaseResponse>> UpdateOriginBusinessCase(int originBusinessCaseId, [FromBody] UpdateOriginBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new UpdateOriginBusinessCaseCommand
            {
                OriginBusinessCaseId = originBusinessCaseId,
                Name = request.Name,
                Notes = request.Notes
            });

            var updateResponse = new UpdateOriginBusinessCaseResponse
            {
                OriginBusinessCaseId = originBusinessCaseId,
                Name = result.Value.Name,
                Notes = result.Value.Notes
            };

            return result.IsSuccess ? Ok(updateResponse) : BadRequest(result.Error);
        }
    }

    public class UpdateOriginBusinessCaseRequest
    {
        public string Name { get; set; }

        public string Notes { get; set; }
    }

    public class UpdateOriginBusinessCaseResponse
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }
    }
}
