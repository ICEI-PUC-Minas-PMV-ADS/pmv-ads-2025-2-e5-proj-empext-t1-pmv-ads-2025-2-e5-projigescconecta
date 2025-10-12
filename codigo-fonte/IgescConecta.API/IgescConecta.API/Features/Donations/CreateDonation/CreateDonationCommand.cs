using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.CreateDonation
{
    public class CreateDonationCommand : IRequest<Result<int, ValidationFailed>>
    {
        public decimal Value { get; set; }
        public DateTime DonationDate { get; set; }

        public int? PersonId { get; set; }
        public int? CompanyId { get; set; }
        public int? OscId { get; set; }
        public int? TeamId { get; set; }
    }

    internal sealed class CreateDonationCommandHandler : IRequestHandler<CreateDonationCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateDonationCommand request, CancellationToken cancellationToken)
        {
            if (request.Value <= 0)
            {
                return new ValidationFailed("O valor da doação deve ser maior que zero.");
            }

            if (request.PersonId.HasValue == request.CompanyId.HasValue)
            {
                return new ValidationFailed("A doação deve ter exatamente um doador: ou uma Pessoa (PersonId) ou uma Empresa (CompanyId).");
            }

            if (request.OscId.HasValue && request.TeamId.HasValue)
            {
                return new ValidationFailed("A doação pode ser destinada para uma OSC ou para uma Turma, mas não para ambas ao mesmo tempo.");
            }

            var donation = new Donation
            {
                Value = request.Value,
                DonationDate = request.DonationDate,
                PersonId = request.PersonId,
                CompanyId = request.CompanyId,
                OscId = request.OscId,
                TeamId = request.TeamId
            };

            await _context.Donations.AddAsync(donation, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return donation.Id;
        }
    }
}