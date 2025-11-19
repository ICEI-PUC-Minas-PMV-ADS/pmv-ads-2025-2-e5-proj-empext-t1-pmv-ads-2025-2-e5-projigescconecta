using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Oscs.GetOsc
{
    public class GetOscQuery : IRequest<Result<Osc, ValidationFailed>>
    {
        public int OscId { get; set; }
        public GetOscQuery(int id)
        {
            OscId = id;
        }
    }

    internal sealed class GetOscQueryHandler : IRequestHandler<GetOscQuery, Result<Osc, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetOscQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Osc, ValidationFailed>> Handle(GetOscQuery request, CancellationToken cancellationToken)
        {
            var osc = await _context.Oscs
                .IgnoreQueryFilters()
                .Where(osc => osc.Id == request.OscId)
                .Include(osc => osc.Beneficiaries)
                .Include(osc => osc.OriginsBusinessCases)
                .FirstOrDefaultAsync();

            if (osc == null)
            {
                return new ValidationFailed(new[] { "OSC not Found" });
            }

            return osc;
        }
    }
}
