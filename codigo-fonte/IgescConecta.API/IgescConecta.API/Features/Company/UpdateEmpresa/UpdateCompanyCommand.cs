using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Companies.UpdateCompany
{
    public class UpdateCompanyCommand : IRequest<Result<string, ValidationFailed>>
    {
        // O CNPJ virá da rota do endpoint, mas o incluímos aqui para consistência.
        public string CNPJ { get; set; } = string.Empty;

        // Propriedades traduzidas para o inglês
        public string CompanyName { get; set; } = string.Empty;
        public string? CorporateReason { get; set; }
        public string? FieldOfActivity { get; set; }
        public string? ZipCode { get; set; }
        public string? Address { get; set; }
        public string? Neighborhood { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Website { get; set; }
        public string? SocialMedia { get; set; }
    }

    internal sealed class UpdateCompanyCommandHandler : IRequestHandler<UpdateCompanyCommand, Result<string, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<string, ValidationFailed>> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
        {
            // 1. Encontra a empresa existente no banco pelo CNPJ
            var company = await _context.Companies
                .FirstOrDefaultAsync(c => c.CNPJ == request.CNPJ, cancellationToken);

            if (company is null)
            {
                return new ValidationFailed($"Empresa com CNPJ {request.CNPJ} não encontrada.");
            }

            // 2. Atualiza todas as propriedades da entidade com os dados do command
            company.CompanyName = request.CompanyName;
            company.CorporateReason = request.CorporateReason;
            company.FieldOfActivity = request.FieldOfActivity;
            company.ZipCode = request.ZipCode;
            company.Address = request.Address;
            company.Neighborhood = request.Neighborhood;
            company.City = request.City;
            company.State = request.State;
            company.PhoneNumber = request.PhoneNumber;
            company.Website = request.Website;
            company.SocialMedia = request.SocialMedia;

            // 3. O Entity Framework já sabe que a entidade foi modificada, basta salvar.
            await _context.SaveChangesAsync(cancellationToken);

            return company.CNPJ;
        }
    }
}