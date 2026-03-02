using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.API.Features.Persons.GetPerson;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Persons.ListPerson
{
    public class ListPersonViewModel : PaginationResponse<PersonListItemViewModel> { }

    public class PersonListItemViewModel
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PersonalDocumment { get; set; }
        public string? PrimaryPhone { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class ListPersonQuery : PaginationRequest, IRequest<ListPersonViewModel>
    {
        public string? StatusFilter { get; set; }
        public ListPersonQuery(int pageNumber, int pageSize, List<Filter> filters, string? statusFilter) : base(pageNumber, pageSize, filters) 
        {
            StatusFilter = statusFilter;
        }
    }

    internal sealed class ListPersonQueryHandler : IRequestHandler<ListPersonQuery, ListPersonViewModel>
    {
        private readonly ApplicationDbContext _ctx;
        public ListPersonQueryHandler(ApplicationDbContext ctx) => _ctx = ctx;

        public async Task<ListPersonViewModel> Handle(ListPersonQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<Person>(request.Filters);
            var query = _ctx.Persons.AsQueryable().Where(expr);

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

            var total = await query.CountAsync(cancellationToken);

            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(p => new PersonListItemViewModel
                {
                    PersonId = p.Id,
                    Name = p.Name,
                    Email = p.Email,
                    PersonalDocumment = p.PersonalDocumment,
                    PrimaryPhone = p.PrimaryPhone,
                    IsActive = p.IsActive,
                    IsDeleted = p.IsDeleted
                })
                .ToListAsync(cancellationToken);

            return new ListPersonViewModel
            {
                TotalItems = total,
                Items = items
            };
        }
    }
}
