using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.Beneficiares.UpdateBeneficiary
{
    public class UpdateBeneficiaryCommand : IRequest<Result<Beneficiary, ValidationFailed>>
    {
        public int BeneficiaryId { get; set; }

        public string Name { get; set; }

        public string Notes { get; set; }
    }

    internal sealed class UpdateBeneficiaryCommandHandler : IRequestHandler<UpdateBeneficiaryCommand, Result<Beneficiary, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateBeneficiaryCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Beneficiary, ValidationFailed>> Handle(UpdateBeneficiaryCommand request, CancellationToken cancellationToken)
        {
            var beneficiary = await _context.Beneficiaries.FindAsync([request.BeneficiaryId], cancellationToken: cancellationToken);

            if(beneficiary == null)
            {
                return new ValidationFailed(new[] {"Publico beneficiário não encontrado."});
            }

            beneficiary.Name = string.IsNullOrEmpty(request.Name) ? beneficiary.Name : request.Name;
            beneficiary.Notes = string.IsNullOrEmpty(request.Notes) ? beneficiary.Notes : request.Notes;

            await _context.SaveChangesAsync(cancellationToken);

            return beneficiary;
        }
    }
}
