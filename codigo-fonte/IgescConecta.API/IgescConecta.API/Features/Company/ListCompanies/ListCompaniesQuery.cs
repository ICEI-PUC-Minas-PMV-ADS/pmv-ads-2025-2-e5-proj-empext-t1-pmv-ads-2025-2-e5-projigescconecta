using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.Companies.ListCompanies
{
    public class ListCompaniesViewModel : PaginationResponse<CompanyViewModel>
    {
    }

    public class CompanyViewModel
    {
        public int Id { get; set; }
        public string CNPJ { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public string? Telefone { get; set; }
        public bool Ativa { get; set; }
    }

    public class ListCompaniesQuery : PaginationRequest, IRequest<ListCompaniesViewModel>
    {
        public ListCompaniesQuery(int pageNumber, int pageSize, List<Filter> filters)
            : base(pageNumber, pageSize, filters)
        {
        }
    }

    internal sealed class ListCompaniesQueryHandler : IRequestHandler<ListCompaniesQuery, ListCompaniesViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListCompaniesQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListCompaniesViewModel> Handle(ListCompaniesQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Companies.AsQueryable();
            var filters = request.Filters ?? new List<Filter>();

            var statusFilter = filters.FirstOrDefault(f => f.PropertyName.Equals("IsActive", StringComparison.OrdinalIgnoreCase));

            if (statusFilter != null)
            {
                if (bool.TryParse(statusFilter.Value.ToString(), out bool isActive))
                {
                    if (!isActive) 
                    {
                        query = query.IgnoreQueryFilters().Where(c => c.IsDeleted);
                    }
                    else 
                    {
                        query = query.Where(c => !c.IsDeleted);
                    }
                }
                filters.Remove(statusFilter);
            }
            else 
            {
                query = query.IgnoreQueryFilters();
            }

            if (filters.Any())
            {
                var expr = ExpressionBuilder.GetExpression<Company>(filters);
                query = query.Where(expr);
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var items = await query
                .Select(company => new CompanyViewModel
                {
                    Id = company.Id,
                    CNPJ = company.CNPJ,
                    Nome = company.CompanyName,
                    RazaoSocial = company.CorporateReason ?? string.Empty,
                    Telefone = company.PhoneNumber,
                    Ativa = !company.IsDeleted
                })
                .OrderByDescending(c => c.Nome)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            return new ListCompaniesViewModel
            {
                Items = items,
                TotalItems = totalRecords
            };
        }
    }
}