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
                Notes = request.Notes,
                BusinessCaseId = request.BusinessCaseId
            });

            if(!result.IsSuccess)
                return BadRequest(result.Error);

            var createResponse = new CreateOriginBusinessCaseResponse
            {
                Id = result.Value,
                Name = request.Name,
            };

            return Ok(createResponse);
        }
    }

    public class CreateOriginBusinessCaseRequest
    {
        public string Name { get; set; }

        public string Notes { get; set; }

        public int BusinessCaseId { get; set; }
    }

    public class CreateOriginBusinessCaseResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
