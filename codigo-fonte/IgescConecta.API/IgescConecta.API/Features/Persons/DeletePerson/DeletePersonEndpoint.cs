using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Persons.DeletePerson
{
    [Route("/api/persons")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Persons")]
    [Authorize(Roles = "Admin,Editor")]
    public class DeletePersonEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public DeletePersonEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpDelete("{personId:int}", Name = "DeletePerson")]
        public async Task<ActionResult> Delete(int personId)
        {
            var result = await _mediator.Send(new DeletePersonCommand(personId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}

