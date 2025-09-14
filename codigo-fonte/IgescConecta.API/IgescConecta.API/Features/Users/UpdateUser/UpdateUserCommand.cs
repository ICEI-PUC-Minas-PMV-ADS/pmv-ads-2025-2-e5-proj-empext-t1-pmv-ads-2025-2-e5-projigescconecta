using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace IgescConecta.API.Features.Users.UpdateUser
{
    public class UpdateUserCommand : IRequest<Result<User, ValidationFailed>>
    {
        public int UserId { get; set; }

        public string? Name { get; set; }

        public string? Password { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; }

        public string? Role { get; set; }
    }

    internal sealed class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<User, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<User> _userManager;

        public UpdateUserCommandHandler(ApplicationDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<Result<User, ValidationFailed>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users.FindAsync([request.UserId], cancellationToken: cancellationToken);

            if(user == null)
            {
                return new ValidationFailed(["User not found"]);
            }

            user.Name = string.IsNullOrEmpty(request.Name) ? user.Name : request.Name;
            user.Email = string.IsNullOrEmpty(request.Email) ? user.Email : request.Email;
            user.PhoneNumber = string.IsNullOrEmpty(request.PhoneNumber) ? user.PhoneNumber : request.PhoneNumber;
            user.IsActive = request.IsActive;

            if(request.Role != null)
            {
                await _userManager.RemoveFromRolesAsync(user, await _userManager.GetRolesAsync(user));
                await _userManager.AddToRoleAsync(user, request.Role.ToUpper());
            }
            await _userManager.UpdateAsync(user);

            if(!string.IsNullOrEmpty(request.Password))
            {
                await _userManager.RemovePasswordAsync(user);
                await _userManager.AddPasswordAsync(user, request.Password);
            }

            return user;
        }
    }
}
