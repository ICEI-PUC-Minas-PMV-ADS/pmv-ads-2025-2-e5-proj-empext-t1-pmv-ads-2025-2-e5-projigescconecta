using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectThemes.ListProjectTheme
{
    public class ListProjectThemeViewModel : PaginationResponse<ProjectThemeViewModel> { }

    public class ProjectThemeViewModel
    {
        public int ProjectThemeId { get; set; }
        public string? Name { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class GetProjectThemeByIdViewModel
    {
        public int ProjectThemeId { get; set; }
        public string? Name { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class GetProjectThemeByIdQuery : IRequest<GetProjectThemeByIdViewModel?>
    {
        public int Id { get; }
        public GetProjectThemeByIdQuery(int id) => Id = id;
    }

    public class ListProjectThemeQuery : PaginationRequest, IRequest<ListProjectThemeViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListProjectThemeQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter)
            : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListProjectThemeQueryHandler
        : IRequestHandler<ListProjectThemeQuery, ListProjectThemeViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListProjectThemeQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListProjectThemeViewModel> Handle(ListProjectThemeQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<ProjectTheme>(request.Filters ?? new List<Filter>());
            var query = _context.ProjectThemes
                .AsNoTracking()
                .AsQueryable()
                .Where(expr);

            if (!string.IsNullOrEmpty(request.StatusFilter))
            {
                if (request.StatusFilter.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query
                        .IgnoreQueryFilters()
                        .Where(x => x.IsDeleted);
                }
                else
                {
                    query = query.IgnoreQueryFilters();
                }
            }

            var result = await query
                .Select(x => new ProjectThemeViewModel
                {
                    ProjectThemeId = x.Id,
                    Name = x.Name,
                    IsDeleted = x.IsDeleted
                })
                .OrderByDescending(x => x.ProjectThemeId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(cancellationToken);

            return new ListProjectThemeViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }

    internal sealed class GetProjectThemeByIdQueryHandler
        : IRequestHandler<GetProjectThemeByIdQuery, GetProjectThemeByIdViewModel?>
    {
        private readonly ApplicationDbContext _context;
        public GetProjectThemeByIdQueryHandler(ApplicationDbContext context) => _context = context;

        public async Task<GetProjectThemeByIdViewModel?> Handle(GetProjectThemeByIdQuery request, CancellationToken cancellationToken)
        {
            var vm = await _context.ProjectThemes
                .IgnoreQueryFilters()
                .Where(x => x.Id == request.Id)
                .Select(x => new GetProjectThemeByIdViewModel
                {
                    ProjectThemeId = x.Id,
                    Name = x.Name,
                    IsDeleted = x.IsDeleted,
                    CreatedBy = x.CreatedBy,
                    CreatedAt = x.CreatedAt,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedAt = x.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            return vm;
        }
    }
}
