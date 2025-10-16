using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.ListDonation
{
    public class DonationDto
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public DateTime Data { get; set; }
        public int? PersonId { get; set; }
        public int? CompanyId { get; set; }
        public int? OscId { get; set; }
        public int? TeamId { get; set; }
    }

    public class ListDonationQuery : IRequest<Result<DonationDto, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class ListDonationQueryHandler : IRequestHandler<ListDonationQuery, Result<DonationDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListDonationQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<DonationDto, ValidationFailed>> Handle(ListDonationQuery request, CancellationToken cancellationToken)
        {
            var donation = await _context.Donations
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            if (donation is null)
            {
                return new ValidationFailed($"Doação com ID {request.Id} não encontrada.");
            }

            var donationDto = new DonationDto
            {
                Id = donation.Id,
                Valor = donation.Value,
                Data = donation.DonationDate,
                PersonId = donation.PersonId,
                CompanyId = donation.CompanyId,
                OscId = donation.OscId,
                TeamId = donation.TeamId
            };

            return donationDto;
        }
    }
}