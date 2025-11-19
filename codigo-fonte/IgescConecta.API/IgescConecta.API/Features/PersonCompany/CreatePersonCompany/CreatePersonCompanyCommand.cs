using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonCompanies.CreatePersonCompany
{
    public class CreatePersonCompanyCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int PersonId { get; set; }
        public int CompanyId { get; set; }
    }

    internal sealed class CreatePersonCompanyCommandHandler : IRequestHandler<CreatePersonCompanyCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreatePersonCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreatePersonCompanyCommand request, CancellationToken cancellationToken)
        {
            var personExists = await _context.Persons
                .AnyAsync(p => p.Id == request.PersonId, cancellationToken);

            if (!personExists)
                return new ValidationFailed(new[] { $"Pessoa com ID {request.PersonId} não encontrada" });

            var companyExists = await _context.Companies
                .AnyAsync(o => o.Id == request.CompanyId, cancellationToken);

            if (!companyExists)
                return new ValidationFailed(new[] { $"Empresa com ID {request.CompanyId} não encontrada" });

            var existsPersonCompany = await _context.PersonCompanies
                .AnyAsync(pc => pc.PersonId == request.PersonId && pc.CompanyId == request.CompanyId, cancellationToken);

            if (existsPersonCompany)
                return new ValidationFailed(new[] { "Já existe um vínculo entre esta pessoa e esta empresa" });

            var personCompany = new PersonCompany
            {
                PersonId = request.PersonId,
                CompanyId = request.CompanyId,
            };

            await _context.PersonCompanies.AddAsync(personCompany, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return personCompany.Id;
        }
    }
}