using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Users.ListUser
{
    public class ListUserViewModel : PaginationResponse<UserViewModel>
    {
    }

    public class UserViewModel
    {
        public int UserId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string Role { get; set; }

        public string PhoneNumber { get; set; }

        public bool IsActive { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }

        public bool IsDeleted { get; set; }
    }

    public class ListUserQuery : PaginationRequest, IRequest<ListUserViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListUserQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter) : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListUserQueryHandler : IRequestHandler<ListUserQuery, ListUserViewModel>
    {
        private readonly UserManager<User> _userManager;

        public ListUserQueryHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<ListUserViewModel> Handle(ListUserQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<User>(request.Filters);
            var query = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(request.StatusFilter))
            {
                if (request.StatusFilter.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query.Where(u => !u.IsActive);
                }
            }

            var result = await query.Where(expr)
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var users = new List<UserViewModel>();
            foreach(var item in result)
            {
                var user = new UserViewModel
                {
                    UserId = item.Id,
                    Name = item.Name,
                    Email = item.Email,
                    PhoneNumber = item.PhoneNumber,
                    IsActive = item.IsActive,
                    UpdatedBy = item.UpdatedBy,
                    UpdatedAt = item.UpdatedAt,
                    IsDeleted = !item.IsActive
                };
                user.Role = (await _userManager.GetRolesAsync(item)).FirstOrDefault() ?? string.Empty;
                users.Add(user);
            }

            var totalRecords = await query.Where(expr).CountAsync(cancellationToken);

            return new ListUserViewModel
            {
                Items = users,
                TotalItems = totalRecords,
            };
        }
    }
}
