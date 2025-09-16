using IgescConecta.API.Common.Extensions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Users.UpdateUser
{
    [ApiAuthorize]
    [Route("/api/users")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Users")]
    public class UpdateUserEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public UpdateUserEndpoint(IMediator mediator) 
        { 
            _mediator = mediator;
        }

        [HttpPut("{userId}", Name = "UpdateUser")]
        public async Task<ActionResult<UpdateUserResponse>> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            var result = await _mediator.Send(new UpdateUserCommand
            {
                UserId = request.UserId,
                Name = request.Name,
                Password = request.Password,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                IsActive = request.IsActive,
                Role = request.Role
            });

            var updateResponse = new UpdateUserResponse
            {
                Name = result.Value.Name,
                Email = result.Value.Email,
                PhoneNumber = result.Value.PhoneNumber,
                IsActive = result.Value.IsActive,
                Role = request.Role ?? ""
            };

            return result.IsSuccess ? Ok(updateResponse) : BadRequest(result.Error);
        }
    }

    public class UpdateUserRequest
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public string? Role { get; set; }
    }

    public class UpdateUserResponse
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public string Role { get; set; }
    }
}
