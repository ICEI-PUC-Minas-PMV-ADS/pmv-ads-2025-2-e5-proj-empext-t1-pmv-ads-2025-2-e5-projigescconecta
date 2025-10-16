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
        public int? CourseId { get; set; }
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
                return new ValidationFailed("O valor da doa��o deve ser maior que zero.");
            }

            if (request.PersonId.HasValue == request.CompanyId.HasValue)
            {
                return new ValidationFailed("A doa��o deve ter exatamente um doador: ou uma Pessoa (PersonId) ou uma Empresa (CompanyId).");
            }

            if (request.OscId.HasValue && request.CourseId.HasValue)
            {
                return new ValidationFailed("A doa��o pode ser destinada para uma OSC ou para um Curso/Turma, mas n�o para ambos ao mesmo tempo.");
            }

            if (request.TeamId.HasValue && !request.CourseId.HasValue)
            {
                return new ValidationFailed("Uma doa��o para uma Turma (TeamId) tamb�m deve especificar o Curso (CourseId).");
            }

            if (request.CourseId.HasValue && !request.TeamId.HasValue)
            {
                return new ValidationFailed("Uma doa��o para um Curso deve especificar uma Turma (TeamId). A doa��o n�o pode ser para um curso em geral.");
            }

            var finalDonationDate = request.DonationDate.Date + DateTime.UtcNow.TimeOfDay;

            var donation = new Donation
            {
                Value = request.Value,
                DonationDate = finalDonationDate,
                PersonId = request.PersonId,
                CompanyId = request.CompanyId,
                OscId = request.OscId,
                CourseId = request.CourseId,
                TeamId = request.TeamId
            };

            await _context.Donations.AddAsync(donation, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return donation.Id;
        }
    }
}