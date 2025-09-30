using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;

namespace IgescConecta.API.Features.Beneficiares.CreateBeneficiary
{
    public class CreateBeneficiaryCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }
    }

    internal sealed class CreateBeneficiaryCommandHandler : IRequestHandler<CreateBeneficiaryCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;
        public CreateBeneficiaryCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateBeneficiaryCommand request, CancellationToken cancellationToken)
        {
            var beneficiary = new Beneficiary
            {
                Name = request.Name
            };

            await _context.Beneficiaries.AddAsync(beneficiary, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return beneficiary.Id;
        }
    }
}
