using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Companies.InactivateCompany
{
    public class InactivateCompanyCommand : IRequest<Result<Unit, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
    }

    internal sealed class InactivateCompanyCommandHandler : IRequestHandler<InactivateCompanyCommand, Result<Unit, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public InactivateCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit, ValidationFailed>> Handle(InactivateCompanyCommand request, CancellationToken cancellationToken)
        {
            var company = await _context.Companies
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.CNPJ == request.CNPJ, cancellationToken);

            if (company is null)
            {
                return new ValidationFailed($"Empresa com CNPJ {request.CNPJ} não encontrada.");
            }

            if (company.IsDeleted)
            {
                return new ValidationFailed($"Empresa com CNPJ {request.CNPJ} já está inativa.");
            }

            company.IsDeleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}