using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.API.Features.Beneficiares;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Oscs.CreateOsc
{
    public class CreateOscCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string Name { get; set; }

        public string Objective { get; set; }

        public string CorporateName { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string? OscPrimaryDocumment { get; set; }

        public List<int> BeneficiariesIds { get; set; } = [];

        public List<int> OriginsBusinessCasesIds { get; set; } = [];
    }

    internal sealed class CreateOscCommandHandler : IRequestHandler<CreateOscCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateOscCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateOscCommand request, CancellationToken cancellationToken)
        {
            var osc = new Osc
            {
                Name = request.Name,
                OscPrimaryDocumment = request.OscPrimaryDocumment,
                Address = request.Address,
                CorporateName = request.CorporateName,
                Objective = request.Objective,
                ZipCode = request.ZipCode
            };

            if (request.BeneficiariesIds.Any())
            {
                var beneficiares = await _context.Beneficiaries
                    .Where(b => request.BeneficiariesIds.Contains(b.Id))
                    .ToListAsync();

                osc.Beneficiaries = beneficiares;
            }

            if (request.OriginsBusinessCasesIds.Any())
            {
                var orginnsBusinessCases = await _context.OriginBusinessCases
                    .Where(o => request.OriginsBusinessCasesIds.Contains(o.Id))
                    .ToListAsync();

                osc.OriginsBusinessCases = orginnsBusinessCases;
            }

            await _context.Oscs.AddAsync(osc, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return osc.Id;
        }
    }
}
