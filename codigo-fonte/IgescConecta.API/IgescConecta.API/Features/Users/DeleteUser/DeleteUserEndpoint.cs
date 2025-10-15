using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace IgescConecta.API.Features.Users.DeleteUser
{
    [ApiAuthorize]
    [Route("api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    [Authorize(Roles = "Admin,Editor")]
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
