using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Users.CreateUser
{
    [Route("/api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    public class CreateUserEndPoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public CreateUserEndPoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateUser", Name = "CreateUser")]
        public async Task<ActionResult<CreateUserResponse>> CreateUser([FromBody] CreateUserRequest request)
        {
            var result = await _mediator.Send(new CreateUserCommand
            {
                Name = request.Name,
                Password = request.Password,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Role = request.Role
            });

            return result.IsSuccess ? Ok(new CreateUserResponse(result.Value)) : BadRequest(result.Error);
        }
    }

    public class CreateUserRequest
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Role { get; set; }
    }

    public class CreateUserResponse
    {
        public int UserId { get; set; }

        public CreateUserResponse(int userId) 
        { 
            UserId = userId; 
        }
    }
}
