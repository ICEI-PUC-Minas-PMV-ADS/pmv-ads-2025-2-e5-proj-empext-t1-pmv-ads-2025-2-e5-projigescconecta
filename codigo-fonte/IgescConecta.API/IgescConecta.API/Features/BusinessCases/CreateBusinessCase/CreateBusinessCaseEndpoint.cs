using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.BusinessCases.CreateBusinessCase
{
    [ApiAuthorize]
    [Route("/api/businesscase")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "BusinessCases")]
    public class CreateBusinessCaseEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateBusinessCaseEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateBusinessCase", Name = "CreateBusinessCase")]
        public async Task<ActionResult<CreateBusinessCaseResponse>> CreateBusinessCase([FromBody] CreateBusinessCaseRequest request)
        {
            var result = await _mediator.Send(new CreateBusinessCaseCommand
            {
                Name = request.Name,
                OriginsBusinessCasesIds = request.OriginsBusinessCasesIds
            });

            if(!result.IsSuccess)
                return BadRequest(result.Error);

            var createResponse = new CreateBusinessCaseResponse
            {
                Id = result.Value,
                Name = request.Name
            };

            return Ok(createResponse);
        }
    }

    public class CreateBusinessCaseRequest
    {
        public string Name { get; set; }

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    public class CreateBusinessCaseResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}
