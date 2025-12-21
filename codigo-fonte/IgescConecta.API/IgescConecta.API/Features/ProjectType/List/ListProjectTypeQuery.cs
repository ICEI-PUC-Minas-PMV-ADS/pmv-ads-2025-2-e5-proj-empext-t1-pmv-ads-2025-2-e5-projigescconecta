using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectTypes.ListProjectType
{
    public class ListProjectTypeViewModel : PaginationResponse<ProjectTypeViewModel> { }

    public class ProjectTypeViewModel
    {
        public int ProjectTypeId { get; set; }
        public string? Name { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class GetProjectTypeByIdViewModel
    {
        public int ProjectTypeId { get; set; }
        public string? Name { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class GetProjectTypeByIdQuery : IRequest<GetProjectTypeByIdViewModel?>
    {
        public int Id { get; }
        public GetProjectTypeByIdQuery(int id) => Id = id;
    }

    public class ListProjectTypeQuery : PaginationRequest, IRequest<ListProjectTypeViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListProjectTypeQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter)
            : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListProjectTypeQueryHandler
        : IRequestHandler<ListProjectTypeQuery, ListProjectTypeViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListProjectTypeQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListProjectTypeViewModel> Handle(ListProjectTypeQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<ProjectType>(request.Filters ?? new List<Filter>());
            var query = _context.ProjectTypes
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
                .Select(x => new ProjectTypeViewModel
                {
                    ProjectTypeId = x.Id,
                    Name = x.Name,
                    IsDeleted = x.IsDeleted
                })
                .OrderByDescending(x => x.ProjectTypeId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(cancellationToken);

            return new ListProjectTypeViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }

    internal sealed class GetProjectTypeByIdQueryHandler
        : IRequestHandler<GetProjectTypeByIdQuery, GetProjectTypeByIdViewModel?>
    {
        private readonly ApplicationDbContext _context;
        public GetProjectTypeByIdQueryHandler(ApplicationDbContext context) => _context = context;

        public async Task<GetProjectTypeByIdViewModel?> Handle(GetProjectTypeByIdQuery request, CancellationToken cancellationToken)
        {
            var vm = await _context.ProjectTypes
                .IgnoreQueryFilters()
                .Where(x => x.Id == request.Id)
                .Select(x => new GetProjectTypeByIdViewModel
                {
                    ProjectTypeId = x.Id,
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
