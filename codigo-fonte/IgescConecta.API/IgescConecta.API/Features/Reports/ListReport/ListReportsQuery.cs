using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.ListReports
{
    public class ListReportsQuery : IRequest<Result<ListReportsDto, ValidationFailed>>
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter> Filters { get; set; } = [];
    }

    public class ListReportsDto
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<ListReportItemDto> Items { get; set; } = [];
    }

    public class ListReportItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string RootEntity { get; set; } = default!;
        public ReportStatus Status { get; set; }
        public bool ReaderCanExecute { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    internal sealed class ListReportsQueryHandler
        : IRequestHandler<ListReportsQuery, Result<ListReportsDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListReportsQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<ListReportsDto, ValidationFailed>> Handle(ListReportsQuery request, CancellationToken ct)
        {
            if (request.PageNumber < 1) request.PageNumber = 1;
            if (request.PageSize < 1) request.PageSize = 10;

            IQueryable<Report> query = _context.Reports.AsNoTracking();

            if (request.Filters is { Count: > 0 })
            {
                var predicate = ExpressionBuilder.GetExpression<Report>(request.Filters);
                query = query.Where(predicate);
            }

            var total = await query.CountAsync(ct);

            var items = await query
                .OrderByDescending(r => r.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(r => new ListReportItemDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    RootEntity = r.RootEntity,
                    Status = r.Status,
                    ReaderCanExecute = r.ReaderCanExecute,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync(ct);

            return new ListReportsDto
            {
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalCount = total,
                Items = items
            };
        }
    }
}
