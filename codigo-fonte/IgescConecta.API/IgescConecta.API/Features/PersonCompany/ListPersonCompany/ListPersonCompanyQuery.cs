using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.PersonCompanies.ListPersonCompany
{
    public class ListPersonCompanyViewModel : PaginationResponse<PersonCompanyViewModel>
    {
    }

    public class PersonCompanyViewModel
    {
        public int PersonCompanyId { get; set; }
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PersonalDocumment { get; set; }
        public string? PrimaryPhone { get; set; }
    }

    public class ListPersonCompanyQuery : PaginationRequest, IRequest<ListPersonCompanyViewModel>
    {
        public int CompanyId { get; set; }

        public ListPersonCompanyQuery(int pageNumber, int pageSize, List<Filter> filters, int companyId) : base(pageNumber, pageSize, filters)
        {
            CompanyId = companyId;
        }
    }

    internal sealed class ListPersonCompanyQueryHandler : IRequestHandler<ListPersonCompanyQuery, ListPersonCompanyViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListPersonCompanyQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListPersonCompanyViewModel> Handle(ListPersonCompanyQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<PersonCompany>(request.Filters);
            var query = _context.PersonCompanies
                .AsQueryable()
                .Where(pc => pc.CompanyId == request.CompanyId)
                .Include(pc => pc.Person)
                .Where(expr);

            var result = await query.Select(pc => new PersonCompanyViewModel
            {
                PersonCompanyId = pc.Id,
                PersonId = pc.Person.Id,
                Name = pc.Person.Name,
                Email = pc.Person.Email,
                PersonalDocumment = pc.Person.PersonalDocumment,
                PrimaryPhone = pc.Person.PrimaryPhone
            })
                .OrderByDescending(x => x.PersonCompanyId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(cancellationToken);

            return new ListPersonCompanyViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}