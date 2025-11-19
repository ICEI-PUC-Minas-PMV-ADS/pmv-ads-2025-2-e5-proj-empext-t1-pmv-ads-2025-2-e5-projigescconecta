using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonCompanies.DeletePersonCompany
{
    public class DeletePersonCompanyCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class DeletePersonCompanyCommandHandler : IRequestHandler<DeletePersonCompanyCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeletePersonCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(DeletePersonCompanyCommand request, CancellationToken cancellationToken)
        {
            var personCompany = await _context.PersonCompanies
                .FirstOrDefaultAsync(pc => pc.Id == request.Id, cancellationToken);

            if (personCompany is null)
            {
                return new ValidationFailed($"Vínculo Pessoa-Empresa com ID {request.Id} não encontrado.");
            }

            _context.PersonCompanies.Remove(personCompany);
            await _context.SaveChangesAsync(cancellationToken);

            return personCompany.Id;
        }
    }
}