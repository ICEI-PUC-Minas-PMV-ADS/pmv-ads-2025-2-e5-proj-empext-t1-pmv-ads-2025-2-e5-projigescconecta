using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.OriginsBusinessCases.CreateOriginBusinessCase
{
    [ApiAuthorize]
    [Route("/api/origins-business-cases")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "OriginsBusinessCases")]
    public class CreateOriginBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateOriginBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateOriginBusinessCase", Name = "CreateOriginBusinessCase")]
        public async Task<ActionResult<CreateOriginBusinessCaseResponse>> CreateOriginBusinessCase([FromBody] CreateOriginBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new CreateOriginBusinessCaseCommand
            {
                Name = request.Name,
                BusinessCaseId = request.BusinessCaseId
            });

            return result.IsSuccess ? Ok(new CreateOriginBusinessCaseResponse(result.Value)) : BadRequest(result.Error);
        }
    }

    public class CreateOriginBusinessCaseRequest
    {
        public string Name { get; set; }
        public int BusinessCaseId { get; set; }
    }

    public class CreateOriginBusinessCaseResponse
    {
        public int OriginBusinessCaseId { get; set; }
        public CreateOriginBusinessCaseResponse(int originBusinessCaseId)
        {
            OriginBusinessCaseId = originBusinessCaseId;
        }
    }
}
