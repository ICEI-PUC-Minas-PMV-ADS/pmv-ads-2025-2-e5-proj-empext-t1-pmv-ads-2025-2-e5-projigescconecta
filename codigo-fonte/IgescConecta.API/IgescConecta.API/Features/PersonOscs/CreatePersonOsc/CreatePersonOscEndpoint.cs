using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.PersonOscs.CreatePersonOsc
{
    [ApiAuthorize]
    [Route("/api/persons-osc")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "PersonOsc")]
    public class CreatePersonOscEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreatePersonOscEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("{OscId}/create", Name = "CreatePersonOsc")]
        public async Task<ActionResult<CreatePersonOscResponse>> CreatePersonOsc(int OscId, [FromBody] CreatePersonOscRequest request)
        {
            var result = await _mediator.Send(new CreatePersonOscCommand
            {
                OscId = OscId,
                PersonId =  request.PersonId
            });

            if(!result.IsSuccess)
                return BadRequest(result.Error);

            var createPersonOsc = new CreatePersonOscResponse
            {
                Id = result.Value.Id,
                Name = result.Value.Name,
            };

            return Ok(createPersonOsc);
        }
    }
}

public class CreatePersonOscRequest
{
    public int PersonId { get; set; }
}

public class CreatePersonOscResponse
{
    public int Id { get; set; }

    public string Name { get; set; }
}
