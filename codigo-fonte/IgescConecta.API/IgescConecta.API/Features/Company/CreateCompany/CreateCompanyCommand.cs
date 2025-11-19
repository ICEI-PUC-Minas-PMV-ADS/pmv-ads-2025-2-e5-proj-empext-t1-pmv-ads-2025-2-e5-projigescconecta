using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Companies.CreateCompany
{
    public class CreateCompanyCommand : IRequest<Result<string, ValidationFailed>>
    {
        public string CNPJ { get; set; } = string.Empty;
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
        public string? Email { get; set; } 
        public bool IsActive { get; set; } = true;
    }

    internal sealed class CreateCompanyCommandHandler : IRequestHandler<CreateCompanyCommand, Result<string, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateCompanyCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<string, ValidationFailed>> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.CNPJ) || request.CNPJ.Length != 14 || !request.CNPJ.All(char.IsDigit))
            {
                return new ValidationFailed("O CNPJ deve conter exatamente 14 dígitos numéricos.");
            }

            if (string.IsNullOrWhiteSpace(request.CompanyName))
            {
                return new ValidationFailed("O nome da empresa (CompanyName) é obrigatório.");
            }

            if (string.IsNullOrWhiteSpace(request.CorporateReason))
            {
                return new ValidationFailed("A razão social (CorporateReason) é obrigatória.");
            }

            var existingCompany = await _context.Companies
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(c => c.CNPJ == request.CNPJ, cancellationToken);

            if (existingCompany != null)
            {
                return new ValidationFailed("Uma empresa com este CNPJ já está cadastrada (seja ela ativa ou inativa).");
            }

            var company = new Company
            {
                CNPJ = request.CNPJ,
                CompanyName = request.CompanyName,
                CorporateReason = request.CorporateReason,
                FieldOfActivity = request.FieldOfActivity,
                ZipCode = request.ZipCode,
                Address = request.Address,
                Neighborhood = request.Neighborhood,
                City = request.City,
                State = request.State,
                PhoneNumber = request.PhoneNumber,
                Website = request.Website,
                SocialMedia = request.SocialMedia,
                Email = request.Email, 
                IsDeleted = !request.IsActive
            };

            await _context.Companies.AddAsync(company, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return company.CNPJ;
        }
    }
}