using IgescConecta.API.Features.Users.ListUser; // UserViewModel
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Users.GetId
{
    [Route("/api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    [Authorize(Roles = "Admin,Editor")]
    public class GetUserByIdEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public GetUserByIdEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("{userId:int}", Name = "GetUserById")]
        [ProducesResponseType(typeof(UserViewModel), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<UserViewModel>> GetUserById([FromRoute] int userId)
        {
            var vm = await _mediator.Send(new GetUserByIdQuery(userId));
            if (vm is null) return NotFound();
            return Ok(vm);
        }
    }
}
