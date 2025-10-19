using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.CreateBusinessCase
{
    public class CreateBusinessCaseCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    internal sealed class CreateBusinessCaseCommandHandler : IRequestHandler<CreateBusinessCaseCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateBusinessCaseCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateBusinessCaseCommand request, CancellationToken cancellationToken)
        {
            var businessCase = new BusinessCase
            {
                Name = request.Name,
            };

            if (request.OriginsBusinessCasesIds.Any())
            {
                var originBusinessCase = await _context.OriginBusinessCases
                    .Where(obc => request.OriginsBusinessCasesIds.Contains(obc.Id))
                    .ToListAsync();

                businessCase.Origins = originBusinessCase;
            }

            await _context.BusinessCases.AddAsync(businessCase);
            await _context.SaveChangesAsync(cancellationToken);
            return businessCase.Id;
        }
    }
}
