using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Beneficiares.GetBeneficiary
{
    public class GetBeneficiaryQuery : IRequest<Result<Beneficiary, ValidationFailed>>
    {
        public int BeneficiaryId { get; set; }

        public GetBeneficiaryQuery(int id)
        {
            BeneficiaryId = id;
        }
    }

    internal sealed class GetBenefiaryQueryHandler : IRequestHandler<GetBeneficiaryQuery, Result<Beneficiary, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetBenefiaryQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Beneficiary, ValidationFailed>> Handle(GetBeneficiaryQuery request, CancellationToken cancellationToken)
        {
            var beneficiary = await _context.Beneficiaries.Where(b => b.Id == request.BeneficiaryId)
                .Include(b => b.Oscs)
                .FirstOrDefaultAsync();

            if (beneficiary == null)
            {
                return new ValidationFailed(new[] { "Beneficiary not Found" });
            }

            return beneficiary;
        }
    }
}
