using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Oscs.ListOscs
{
    public class ListOscViewModel : PaginationResponse<OscViewModel>
    {
    }

    public class OscViewModel
    {
        public int OscId { get; set; }

        public string Name { get; set; }

        public string Objective { get; set; }

        public string CorporateName { get; set; }

        public string Address { get; set; }

        public string Neighborhood { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string WebUrl { get; set; }

        public string SocialMedia { get; set; }

        public string ZipCode { get; set; }

        public string OscPrimaryDocumment { get; set; }

        public int BeneficiariesCount { get; set; }

        public bool IsDeleted { get; set; }
    }

    public class ListOscQuery : PaginationRequest, IRequest<ListOscViewModel>
    {
        public int? BeneficiaryId { get; set; }

        public int? OriginBussinesCaseId { get; set; }

        public string? StatusFilter { get; set; }

        public ListOscQuery(int pageNumber, int pageSize, List<Filter> filters, int? beneficiaryId, int? originBussinesCaseId, string? statusFilter) : base(pageNumber, pageSize, filters)
        {
            BeneficiaryId = beneficiaryId;
            OriginBussinesCaseId = originBussinesCaseId;
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListOscQueryHandler : IRequestHandler<ListOscQuery, ListOscViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListOscQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListOscViewModel> Handle(ListOscQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<Osc>(request.Filters);
            var query = _context.Oscs
                .AsQueryable()
                .Include(o => o.Beneficiaries)
                .Include(o => o.OriginsBusinessCases)
                .Where(expr);

            if (request.BeneficiaryId.HasValue)
            {
                query = query.Where(o => o.Beneficiaries.Any(b => b.Id == request.BeneficiaryId));
            }

            if (request.OriginBussinesCaseId.HasValue)
            {
                query = query.Where(o => o.OriginsBusinessCases.Any(obc => obc.Id == request.OriginBussinesCaseId));
            }

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

            var result = await query.Select(osc => new OscViewModel
            {
                OscId = osc.Id,
                Name = osc.Name,
                Objective = osc.Objective,
                CorporateName = osc.CorporateName,
                Address = osc.Address,
                Neighborhood = osc.Neighborhood,
                City = osc.City,
                State = osc.State,
                PhoneNumber = osc.PhoneNumber,
                Email = osc.Email,
                WebUrl = osc.WebUrl,
                SocialMedia = osc.SocialMedia,
                ZipCode = osc.ZipCode,
                OscPrimaryDocumment = osc.OscPrimaryDocumment,
                BeneficiariesCount = _context.Beneficiaries
                    .Count(b => b.Oscs.Any(o => o.Id == osc.Id)),
                IsDeleted = osc.IsDeleted
            })
                .OrderByDescending(x => x.OscId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.Oscs.CountAsync(expr, cancellationToken);

            return new ListOscViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}
