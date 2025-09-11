using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace IgescConecta.API.Features.Users.DeleteUser
{
    [Route("api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    public class DeleteUserEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DeleteUserEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpDelete("{userId}", Name = "DeleteUser")]
        public async Task<ActionResult> DeleteUser(int userId)
        {
            var result = await _mediator.Send(new DeleteUserCommand(userId));
            return result.IsSuccess ? Ok() : BadRequest(result.Error);
        }
    }
}
