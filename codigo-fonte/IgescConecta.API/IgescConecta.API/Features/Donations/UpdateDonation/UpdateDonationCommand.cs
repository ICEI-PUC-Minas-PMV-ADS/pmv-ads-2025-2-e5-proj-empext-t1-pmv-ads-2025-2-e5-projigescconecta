using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.UpdateDonation
{
    public class UpdateDonationCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime DonationDate { get; set; }

        public int? OscId { get; set; }
        public int? CourseId { get; set; } 
        public int? TeamId { get; set; }
    }

    internal sealed class UpdateDonationCommandHandler : IRequestHandler<UpdateDonationCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public UpdateDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(UpdateDonationCommand request, CancellationToken cancellationToken)
        {
            var donation = await _context.Donations
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            if (donation is null)
            {
                return new ValidationFailed($"Doação com ID {request.Id} não encontrada.");
            }

            if (request.Value <= 0)
            {
                return new ValidationFailed("O valor da doação deve ser maior que zero.");
            }

            if (request.OscId.HasValue && request.CourseId.HasValue)
            {
                return new ValidationFailed("A doação pode ser destinada para uma OSC ou para um Curso/Turma, mas não para ambos ao mesmo tempo.");
            }

            if (request.TeamId.HasValue && !request.CourseId.HasValue)
            {
                return new ValidationFailed("Uma doação para uma Turma (TeamId) também deve especificar o Curso (CourseId).");
            }

            if (request.CourseId.HasValue && !request.TeamId.HasValue)
            {
                return new ValidationFailed("Uma doação para um Curso deve especificar uma Turma (TeamId).");
            }

            donation.Value = request.Value;
            donation.DonationDate = request.DonationDate;
            donation.OscId = request.OscId;
            donation.CourseId = request.CourseId;
            donation.TeamId = request.TeamId;


            await _context.SaveChangesAsync(cancellationToken);

            return donation.Id;
        }
    }
}