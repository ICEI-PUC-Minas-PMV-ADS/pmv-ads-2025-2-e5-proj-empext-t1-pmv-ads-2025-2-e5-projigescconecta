using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.Donations.ListDonations
{
    public class ListDonationsViewModel : PaginationResponse<DonationViewModel>
    {
    }

    public class DonationViewModel
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime DonationDate { get; set; }
        public string DoadorNome { get; set; } = string.Empty;
        public string DestinoNome { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
    }

    public class ListDonationsQuery : PaginationRequest, IRequest<ListDonationsViewModel>
    {
        public string? StatusFilter { get; set; }

        public ListDonationsQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter)
            : base(pageNumber, pageSize, filters)
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListDonationsQueryHandler : IRequestHandler<ListDonationsQuery, ListDonationsViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListDonationsQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListDonationsViewModel> Handle(ListDonationsQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<Donation>(request.Filters);

            var query = _context.Donations.AsNoTracking()
                .Include(d => d.Person)
                .Include(d => d.Company)
                .Include(d => d.Osc)
                .Include(d => d.Team)
                .AsQueryable();

            if (!string.IsNullOrEmpty(request.StatusFilter))
            {
                if (request.StatusFilter.Equals("Inactive", StringComparison.OrdinalIgnoreCase))
                {
                    query = query
                        .IgnoreQueryFilters()
                        .Where(t => t.IsDeleted);
                }
                else
                {
                    query = query.IgnoreQueryFilters();
                }
            }

            var totalRecords = await query.Where(expr).CountAsync(cancellationToken);

            var items = await query
                .Where(expr)
                .OrderByDescending(d => d.DonationDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(donation => new DonationViewModel
                {
                    Id = donation.Id,
                    Value = donation.Value,
                    DonationDate = donation.DonationDate,
                    DoadorNome = donation.Person != null ? donation.Person.Name : (donation.Company != null ? donation.Company.CompanyName : "N/A"),
                    DestinoNome = donation.Osc != null ? donation.Osc.Name : (donation.Team != null ? donation.Team.Name : "IGESC (Geral)"),
                    IsDeleted = donation.IsDeleted
                })
                .ToListAsync(cancellationToken);

            return new ListDonationsViewModel
            {
                Items = items,
                TotalItems = totalRecords
            };
        }
    }
}