using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Companies.ReactivateCompany
{
    public class ReactivateCompanyCommand : IRequest<Result<Unit, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
    }

    internal sealed class ReactivateCompanyCommandHandler : IRequestHandler<ReactivateCompanyCommand, Result<Unit, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ReactivateCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit, ValidationFailed>> Handle(ReactivateCompanyCommand request, CancellationToken cancellationToken)
        {
            var company = await _context.Companies
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.CNPJ == request.CNPJ, cancellationToken);

            if (company is null)
            {
                return new ValidationFailed($"Empresa com CNPJ {request.CNPJ} não encontrada.");
            }

            if (!company.IsDeleted)
            {
                return new ValidationFailed($"A empresa com CNPJ {request.CNPJ} já está ativa.");
            }

            company.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}