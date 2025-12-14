using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Beneficiares.ListBeneficiaries
{
    public class ListBeneficiaryViewModel : PaginationResponse<BeneficiaryViewModel>
    {
    }

    public class BeneficiaryViewModel
    {
        public int BeneficiaryId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }

        public int OscsCount { get; set; }

        public bool IsDeleted { get; set; }
    }

    public class ListBeneficiaryQuery : PaginationRequest, IRequest<ListBeneficiaryViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListBeneficiaryQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter) : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListBeneficiaryQueryHandler : IRequestHandler<ListBeneficiaryQuery, ListBeneficiaryViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListBeneficiaryQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListBeneficiaryViewModel> Handle(ListBeneficiaryQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<Beneficiary>(request.Filters);
            var query = _context.Beneficiaries
                .AsQueryable()
                .Where(expr);

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

            var result = await query.Select(beneficiary => new BeneficiaryViewModel
            {
                BeneficiaryId = beneficiary.Id,
                Name = beneficiary.Name,
                Notes = beneficiary.Notes,
                OscsCount = _context.Oscs
                    .Count(osc => osc.Beneficiaries.Any(b => b.Id == beneficiary.Id)),
                IsDeleted = beneficiary.IsDeleted
            })
                .OrderByDescending(x => x.BeneficiaryId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.Beneficiaries.CountAsync(expr, cancellationToken);

            return new ListBeneficiaryViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}
