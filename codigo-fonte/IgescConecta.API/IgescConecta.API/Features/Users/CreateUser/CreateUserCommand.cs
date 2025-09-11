using MediatR;
using IgescConecta.API.Common.Validation;
using Microsoft.AspNetCore.Identity;
using IgescConecta.Domain.Entities;
using Microsoft.VisualBasic;

namespace IgescConecta.API.Features.Users.CreateUser
{
    public class CreateUserCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public string Role { get; set; }
    }

    internal sealed class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<int, ValidationFailed>>
    {
        private readonly UserManager<User> _userManager;

        public CreateUserCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                Name = request.Name,
                PhoneNumber = request.PhoneNumber,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, request.Role.ToUpper());
                return user.Id;
            }

            return new ValidationFailed(result.Errors.Select(e => e.Description).ToArray());
        }
    }
}
