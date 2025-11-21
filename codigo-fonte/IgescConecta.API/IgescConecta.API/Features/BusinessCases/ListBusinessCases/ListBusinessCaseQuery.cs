using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.ListBusinessCases
{
    public class ListBusinessCaseViewModel : PaginationResponse<BusinessCaseViewModel>
    {
    }

    public class BusinessCaseViewModel
    {
        public int BusinessCaseId { get; set; }

        public string Name { get; set; }

        public int OriginsBusinessCases { get; set; }

        public bool IsDeleted { get; set; }
    }

    public class ListBusinessCaseQuery : PaginationRequest, IRequest<ListBusinessCaseViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListBusinessCaseQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter) : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListBusinessCaseQueryHandler : IRequestHandler<ListBusinessCaseQuery, ListBusinessCaseViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListBusinessCaseQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListBusinessCaseViewModel> Handle(ListBusinessCaseQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<BusinessCase>(request.Filters);
            var query = _context.BusinessCases
                .AsQueryable()
                .Where(expr) ;

            if (!string.IsNullOrEmpty(request.StatusFilter))
            {
                if (request.StatusFilter.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query
                        .IgnoreQueryFilters()
                        .Where(o => o.IsDeleted);
                }
                else
                {
                    query = query.IgnoreQueryFilters();
                }
            }

            var result = await query.Select(bc => new BusinessCaseViewModel
            {
                BusinessCaseId = bc.Id,
                Name = bc.Name,
                OriginsBusinessCases = _context.OriginBusinessCases
                    .Count(obc => obc.BusinessCaseId == bc.Id),
                IsDeleted = bc.IsDeleted,
            })
                .OrderByDescending(bc => bc.BusinessCaseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.BusinessCases.CountAsync(expr, cancellationToken);

            return new ListBusinessCaseViewModel
            {
                Items = result,
                TotalItems = totalRecords,
            };
        }
    }
}
