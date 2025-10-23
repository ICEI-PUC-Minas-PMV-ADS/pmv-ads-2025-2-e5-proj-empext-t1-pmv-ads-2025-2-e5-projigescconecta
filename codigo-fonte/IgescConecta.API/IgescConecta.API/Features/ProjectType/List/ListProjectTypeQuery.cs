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

    public class GetProjectTypeByIdQuery : IRequest<GetProjectTypeByIdViewModel>
    {
        public int Id { get; }
        public GetProjectTypeByIdQuery(int id) => Id = id;
    }

    public class ListProjectTypeQuery : PaginationRequest, IRequest<ListProjectTypeViewModel>
    {
        public bool IncludeDeleted { get; }
        public bool OnlyDeleted { get; }

        public ListProjectTypeQuery(int pageNumber, int pageSize, List<Filter> filters, bool includeDeleted, bool onlyDeleted)
            : base(pageNumber, pageSize, filters)
        {
            IncludeDeleted = includeDeleted;
            OnlyDeleted = onlyDeleted;
        }
    }

    internal sealed class ListProjectTypeQueryHandler
        : IRequestHandler<ListProjectTypeQuery, ListProjectTypeViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListProjectTypeQueryHandler(ApplicationDbContext context) => _context = context;

        public async Task<ListProjectTypeViewModel> Handle(ListProjectTypeQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<ProjectType>(request.Filters);
            var query = _context.ProjectTypes.AsQueryable();

            if (request.OnlyDeleted)
            {
                query = query.Where(x => x.IsDeleted);
            }
            else if (!request.IncludeDeleted)
            {
                query = query.Where(x => !x.IsDeleted);
            }

            var items = await query
                .Where(expr)
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

            var total = await query.CountAsync(expr, cancellationToken);

            return new ListProjectTypeViewModel
            {
                Items = items,
                TotalItems = total
            };
        }
    }

    internal sealed class GetProjectTypeByIdQueryHandler
        : IRequestHandler<GetProjectTypeByIdQuery, GetProjectTypeByIdViewModel>
    {
        private readonly ApplicationDbContext _context;
        public GetProjectTypeByIdQueryHandler(ApplicationDbContext context) => _context = context;

        public async Task<GetProjectTypeByIdViewModel> Handle(GetProjectTypeByIdQuery request, CancellationToken cancellationToken)
        {
            var vm = await _context.ProjectTypes
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
