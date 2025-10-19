using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.OriginsBusinessCases.ListOriginsBusinessCases
{
    public class ListOriginsBusinessCaseByBusinessCaseIdViewModel : PaginationResponse<OriginBusinessCaseByBusinessCaseIdViewModel>
    {
    }

    public class OriginBusinessCaseByBusinessCaseIdViewModel
    {
        public int OriginBusinessCaseId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }

        public int BusinessCaseId { get; set; }
    }

    public class ListOriginsBusinessCaseByBusinessCaseIdQuery : PaginationRequest, IRequest<ListOriginsBusinessCaseByBusinessCaseIdViewModel>
    {
        public int BusinessCaseId { get; set; }

        public ListOriginsBusinessCaseByBusinessCaseIdQuery(int pageNumber, int pageSize, List<Filter> filters, int businessCaseId) : base(pageNumber, pageSize, filters)
        {
            BusinessCaseId = businessCaseId;
        }
    }

    internal sealed class ListOriginsBusinessCaseByBusinessCaseIdHandler : IRequestHandler<ListOriginsBusinessCaseByBusinessCaseIdQuery, ListOriginsBusinessCaseByBusinessCaseIdViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListOriginsBusinessCaseByBusinessCaseIdHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListOriginsBusinessCaseByBusinessCaseIdViewModel> Handle(ListOriginsBusinessCaseByBusinessCaseIdQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<OriginBusinessCase>(request.Filters);
            var query = _context.OriginBusinessCases
                .AsQueryable()
                .Where(obc => obc.BusinessCaseId == request.BusinessCaseId)
                .Where(expr);
            var result = await query.Where(expr).Select(osc => new OriginBusinessCaseByBusinessCaseIdViewModel
            {
                Name = osc.Name,
                Notes = osc.Notes,
                OriginBusinessCaseId = osc.Id,
                BusinessCaseId = osc.BusinessCaseId,
            })
                .OrderByDescending(x => x.OriginBusinessCaseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(expr, cancellationToken);

            return new ListOriginsBusinessCaseByBusinessCaseIdViewModel
            {
                Items = result,
                TotalItems = totalRecords,
            };
        }
    }
}
