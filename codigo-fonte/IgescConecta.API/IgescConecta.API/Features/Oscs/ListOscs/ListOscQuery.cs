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

        public string ZipCode { get; set; }

        public string OscPrimaryDocumment { get; set; }

        public int BeneficiariesCount { get; set; }
    }

    public class ListOscQuery : PaginationRequest, IRequest<ListOscViewModel>
    {
        public ListOscQuery(int pageNumber, int pageSize, List<Filter> filters) : base(pageNumber, pageSize, filters)
        {
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
            var query = _context.Oscs.AsQueryable();
            var result = await query.Where(expr).Select(osc => new OscViewModel
            {
                OscId = osc.Id,
                Name = osc.Name,
                Objective = osc.Objective,
                CorporateName = osc.CorporateName,
                Address = osc.Address,
                ZipCode = osc.ZipCode,
                OscPrimaryDocumment = osc.OscPrimaryDocumment,
                BeneficiariesCount = _context.Beneficiaries
                    .Count(b => b.Oscs.Any(o => o.Id == osc.Id))
            })
                .OrderBy(x => x.OscId)
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
