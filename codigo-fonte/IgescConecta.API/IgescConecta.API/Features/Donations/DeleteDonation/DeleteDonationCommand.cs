using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Donations.DeleteDonation
{
    public class DeleteDonationCommand : IRequest<Result<Unit, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class DeleteDonationCommandHandler : IRequestHandler<DeleteDonationCommand, Result<Unit, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteDonationCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit, ValidationFailed>> Handle(DeleteDonationCommand request, CancellationToken cancellationToken)
        {
            var donation = await _context.Donations
                .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

            if (donation is null)
            {
                return new ValidationFailed($"Doação com ID {request.Id} não encontrada.");
            }

            if (donation.IsDeleted)
            {
                return new ValidationFailed($"Doação com ID {request.Id} já está inativa/deletada.");
            }

            donation.IsDeleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}