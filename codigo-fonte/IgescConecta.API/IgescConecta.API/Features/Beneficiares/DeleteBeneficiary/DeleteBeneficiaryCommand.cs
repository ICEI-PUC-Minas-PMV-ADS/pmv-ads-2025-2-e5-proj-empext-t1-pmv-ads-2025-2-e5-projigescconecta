using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.Beneficiares.DeleteBeneficiary
{
    public class DeleteBeneficiaryCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int BeneficiaryId { get; set; }
        public DeleteBeneficiaryCommand(int beneficiaryId)
        {
            BeneficiaryId = beneficiaryId;
        }
    }

    internal sealed class DeleteBeneficiaryCommandHandler : IRequestHandler<DeleteBeneficiaryCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteBeneficiaryCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeleteBeneficiaryCommand request, CancellationToken cancellationToken)
        {
            var beneficiary = await _context.Beneficiaries.FindAsync([request.BeneficiaryId]);

            if(beneficiary == null)
            {
                return new ValidationFailed(new[] { "Beneficiário não encontrado." });
            }

            _context.Beneficiaries.Remove(beneficiary);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
