using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.UpdateBusinessCase
{
    public class UpdateBusinessCaseCommand : IRequest<Result<BusinessCase, ValidationFailed>>
    {
        public int BusinessCaseId { get; set; }

        public string? Name { get; set; }

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    internal sealed class UpdateBusinessCaseCommandHandler : IRequestHandler<UpdateBusinessCaseCommand, Result<BusinessCase, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<BusinessCase, ValidationFailed>> Handle(UpdateBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var businessCase = await _context.BusinessCases
                .Where(bc => bc.Id == request.BusinessCaseId)
                .Include(bc => bc.Origins)
                .FirstOrDefaultAsync(cancellationToken);

            if (businessCase == null)
                return new ValidationFailed(new[] { "Business Case not Found" });
            
            businessCase.Name = string.IsNullOrEmpty(request.Name) ? businessCase.Name : request.Name;

            if(!request.OriginsBusinessCasesIds.OrderBy(x => x)
                .SequenceEqual(businessCase.Origins.Select(o => o.Id).OrderBy(x => x)))
            {
                var origins = await _context.OriginBusinessCases
                    .Where(obc => request.OriginsBusinessCasesIds.Contains(obc.Id))
                    .ToListAsync(cancellationToken);

                businessCase.Origins = origins;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return businessCase;
        }
    }
}
