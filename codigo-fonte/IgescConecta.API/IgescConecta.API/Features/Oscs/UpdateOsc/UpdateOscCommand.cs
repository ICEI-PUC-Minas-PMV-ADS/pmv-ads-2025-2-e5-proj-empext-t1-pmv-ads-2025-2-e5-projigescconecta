using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Oscs.UpdateOsc
{
    public class UpdateOscCommand : IRequest<Result<Osc, ValidationFailed>>
    {
        public int OscId { get; set; }

        public string? Name { get; set; }

        public string? CorporateName { get; set; }

        public string? Objective { get; set; }

        public string? Address { get; set; }

        public string? Neighborhood { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Email { get; set; }

        public string? WebUrl { get; set; }

        public string? SocialMedia { get; set; }

        public string? ZipCode { get; set; }

        public string? OscPrimaryDocumment { get; set; }

        public List<int>? BeneficiaryIds { get; set; }

        public List<int>? OriginBusinessCaseIds { get; set; }
    }

    internal sealed class UpdateOscEndpointHandler : IRequestHandler<UpdateOscCommand, Result<Osc, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateOscEndpointHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Osc, ValidationFailed>> Handle(UpdateOscCommand request, CancellationToken cancellationToken)
        {
            var osc = await _context.Oscs.Where(osc => osc.Id == request.OscId)
                .Include(o => o.Beneficiaries)
                .Include(o => o.OriginsBusinessCases)
                .FirstOrDefaultAsync();

            if (osc == null)
            {
                return new ValidationFailed(new[] { "OSC not Found" });
            }

            osc.Name = string.IsNullOrEmpty(request.Name) ? osc.Name : request.Name;
            osc.CorporateName = string.IsNullOrEmpty(request.CorporateName) ? osc.CorporateName : request.CorporateName;
            osc.Objective = string.IsNullOrEmpty(request.Objective) ? osc.Objective : request.Objective;
            osc.Address = string.IsNullOrEmpty(request.Address) ? osc.Address : request.Address;
            osc.Neighborhood = string.IsNullOrEmpty(request.Neighborhood) ? osc.Neighborhood : request.Neighborhood;
            osc.City = string.IsNullOrEmpty(request.City) ? osc.City : request.City;
            osc.State = string.IsNullOrEmpty(request.State) ? osc.State : request.State;
            osc.PhoneNumber = string.IsNullOrEmpty(request.PhoneNumber) ? osc.PhoneNumber : request.PhoneNumber;
            osc.Email = string.IsNullOrEmpty(request.Email) ? osc.Email : request.Email;
            osc.WebUrl = string.IsNullOrEmpty(request.WebUrl) ? osc.WebUrl : request.WebUrl;
            osc.SocialMedia = string.IsNullOrEmpty(request.SocialMedia) ? osc.SocialMedia : request.SocialMedia;
            osc.ZipCode = string.IsNullOrEmpty(request.ZipCode) ? osc.ZipCode : request.ZipCode;
            osc.OscPrimaryDocumment = string.IsNullOrEmpty(request.OscPrimaryDocumment) ? osc.OscPrimaryDocumment : request.OscPrimaryDocumment;
            
            if (!request.BeneficiaryIds.OrderBy(x => x)
                .SequenceEqual(osc.Beneficiaries.Select(b => b.Id).OrderBy(x => x)))
            {
                var beneficiaries = await _context.Beneficiaries
                    .Where(b => request.BeneficiaryIds.Contains(b.Id))
                    .ToListAsync(cancellationToken);

                osc.Beneficiaries = beneficiaries;
            }

            if (!request.OriginBusinessCaseIds.OrderBy(x => x)
                .SequenceEqual(osc.OriginsBusinessCases.Select(obc => obc.Id).OrderBy(x => x)))
            {
                var originsBusinessCases = await _context.OriginBusinessCases
                    .Where(o => request.OriginBusinessCaseIds.Contains(o.Id))
                    .ToListAsync(cancellationToken);

                osc.OriginsBusinessCases = originsBusinessCases;
            }

            await _context.SaveChangesAsync(cancellationToken);
            return osc;
        }
    }
}
