using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.BusinessCases.GetBusinessCase
{
    public class GetBusinessCaseQuery : IRequest<Result<BusinessCase,ValidationFailed>>
    {
        public int BusinessCaseId { get; set; }

        public GetBusinessCaseQuery(int id)
        {
            BusinessCaseId = id;
        }
    }

    internal sealed class GetBusinessCaseQueryHandler : IRequestHandler<GetBusinessCaseQuery, Result<BusinessCase, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetBusinessCaseQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<BusinessCase, ValidationFailed>> Handle(GetBusinessCaseQuery request, CancellationToken cancellationToken)
        {
            var businessCase = await _context.BusinessCases
                .Where(bc => bc.Id == request.BusinessCaseId)
                .Include(bc => bc.Origins)
                .FirstOrDefaultAsync();

            if (businessCase == null)
                return new ValidationFailed(new[] { "Business Case not Found" });

            return businessCase;
        }
    }
}
