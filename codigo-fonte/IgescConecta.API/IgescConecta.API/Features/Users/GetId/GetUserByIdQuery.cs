using IgescConecta.API.Features.Users.ListUser; // para reutilizar UserViewModel
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Users.GetId
{
    public record GetUserByIdQuery(int UserId) : IRequest<UserViewModel?>;

    internal sealed class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, UserViewModel?>
    {
        private readonly UserManager<User> _userManager;

        public GetUserByIdQueryHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<UserViewModel?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user is null) return null;

            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? string.Empty;

            return new UserViewModel
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber ?? string.Empty,
                IsActive = user.IsActive,
                Role = role,
                UpdatedBy = user.UpdatedBy,
                UpdatedAt = user.UpdatedAt,
                IsDeleted = !user.IsActive
            };
        }
    }
}
