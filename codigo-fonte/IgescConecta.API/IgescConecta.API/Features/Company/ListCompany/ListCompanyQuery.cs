using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Companies.ListCompany
{
    public class CompanyDto
    {
        public string CNPJ { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public string? AreaAtuacao { get; set; }
        public string? CEP { get; set; }
        public string? Endereco { get; set; }
        public string? Bairro { get; set; }
        public string? Cidade { get; set; }
        public string? UF { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }
        public string? Site { get; set; }
        public string? RedesSociais { get; set; }
        public bool Ativa { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ListCompanyQuery : IRequest<Result<CompanyDto, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
    }

    internal sealed class ListCompanyQueryHandler : IRequestHandler<ListCompanyQuery, Result<CompanyDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListCompanyQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<CompanyDto, ValidationFailed>> Handle(ListCompanyQuery request, CancellationToken cancellationToken)
        {
            var company = await _context.Companies
                .AsNoTracking()
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.CNPJ == request.CNPJ, cancellationToken);

            if (company is null)
            {
                return new ValidationFailed($"Empresa com CNPJ {request.CNPJ} n�o encontrada.");
            }

            var companyDto = new CompanyDto
            {
                CNPJ = company.CNPJ,
                Nome = company.CompanyName,
                RazaoSocial = company.CorporateReason ?? string.Empty,
                AreaAtuacao = company.FieldOfActivity,
                CEP = company.ZipCode,
                Endereco = company.Address,
                Bairro = company.Neighborhood,
                Cidade = company.City,
                UF = company.State,
                Telefone = company.PhoneNumber,
                Site = company.Website,
                RedesSociais = company.SocialMedia,
                Ativa = !company.IsDeleted,
                UpdatedBy = company.UpdatedBy,
                UpdatedAt = company.UpdatedAt
            };

            return companyDto;
        }
    }
}