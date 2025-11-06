using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonOscs.ListPersonOsc
{
    public class ListPersonOscViewModel : PaginationResponse<PersonOscViewModel>
    {
    }

    public class PersonOscViewModel
    {
        public int PersonOscId { get; set; }

        public int PersonId { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public string PersonalDocumment { get; set; }

        public string? PrimaryPhone { get; set; }
    }

    public class ListPersonOscQuery : PaginationRequest, IRequest<ListPersonOscViewModel>
    {
        public int OscId { get; set; }

        public ListPersonOscQuery(int pageNumber, int pageSize, List<Filter> filters, int oscId) : base(pageNumber, pageSize, filters)
        {
            OscId = oscId;
        }
    }

    internal sealed class ListPersonOscQueryHandler : IRequestHandler<ListPersonOscQuery, ListPersonOscViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListPersonOscQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListPersonOscViewModel> Handle(ListPersonOscQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<PersonOsc>(request.Filters);
            var query = _context.PersonOscs
                .AsQueryable()
                .Where(po => po.OscId == request.OscId)
                .Include(po => po.Person)
                .Where(expr);
            var result = await query.Where(expr).Select(po => new PersonOscViewModel
            {
                PersonOscId = po.Id,
                PersonId = po.Person.Id,
                Name = po.Person.Name,
                Email = po.Person.Email,
                PersonalDocumment = po.Person.PersonalDocumment,
                PrimaryPhone = po.Person.PrimaryPhone
            })
                .OrderByDescending(x => x.PersonOscId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(expr, cancellationToken);

            return new ListPersonOscViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}
