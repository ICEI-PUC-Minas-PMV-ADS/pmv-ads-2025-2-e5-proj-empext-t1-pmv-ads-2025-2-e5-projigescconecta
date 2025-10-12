using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.OriginsBusinessCases.ListOriginsBusinessCases
{
    public class ListOriginBusinessCaseViewModel : PaginationResponse<OriginBusinessCaseViewModel>
    {
    }

    public class OriginBusinessCaseViewModel
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }
    }

    public class ListOriginBusinessCaseQuery : PaginationRequest, IRequest<ListOriginBusinessCaseViewModel>
    {
        public ListOriginBusinessCaseQuery(int pageNumber, int pageSize, List<Filter> filters) : base(pageNumber, pageSize, filters)
        {
        }
    }

    internal sealed class ListOriginBusinessCaseHandler : IRequestHandler<ListOriginBusinessCaseQuery, ListOriginBusinessCaseViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListOriginBusinessCaseHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListOriginBusinessCaseViewModel> Handle(ListOriginBusinessCaseQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<OriginBusinessCase>(request.Filters);
            var query = _context.OriginBusinessCases
                .AsQueryable();
            var result = await query.Where(expr).Select(Osc => new OriginBusinessCaseViewModel
            {
                Name = Osc.Name,
                Notes = Osc.Notes,
                OriginBusinessCaseId = Osc.Id,
            })
                .OrderBy(x => x.OriginBusinessCaseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.OriginBusinessCases.CountAsync(expr, cancellationToken);

            return new ListOriginBusinessCaseViewModel
            {
                Items = result,
                TotalItems = totalRecords,
            };
        }
    }
}
