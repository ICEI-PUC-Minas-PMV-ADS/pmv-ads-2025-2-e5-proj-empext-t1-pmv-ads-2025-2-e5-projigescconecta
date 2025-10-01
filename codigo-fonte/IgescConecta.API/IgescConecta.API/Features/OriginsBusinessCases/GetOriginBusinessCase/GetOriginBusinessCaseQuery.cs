using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.OriginsBusinessCases.GetOriginBusinessCase
{
    public class GetOriginBusinessCaseQuery : IRequest<Result<OriginBusinessCase, ValidationFailed>>
    {
        public int OriginBusinessCaseId { get; set; }

        public GetOriginBusinessCaseQuery(int id)
        {
            OriginBusinessCaseId = id;
        }
    }

    internal sealed class GetOriginBusinessCaseQueryHandler : IRequestHandler<GetOriginBusinessCaseQuery, Result<OriginBusinessCase, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetOriginBusinessCaseQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<OriginBusinessCase, ValidationFailed>> Handle(GetOriginBusinessCaseQuery request, CancellationToken cancellationToken)
        {
            var originBusinessCase = await _context.OriginBusinessCases
                .Where(obc => obc.Id == request.OriginBusinessCaseId)
                .Include(obc => obc.Oscs)
                .FirstOrDefaultAsync(cancellationToken);

            if (originBusinessCase == null)
                return new ValidationFailed(new[] { "Origin Business Case not Found" });

            return originBusinessCase;
        }
    }
}
