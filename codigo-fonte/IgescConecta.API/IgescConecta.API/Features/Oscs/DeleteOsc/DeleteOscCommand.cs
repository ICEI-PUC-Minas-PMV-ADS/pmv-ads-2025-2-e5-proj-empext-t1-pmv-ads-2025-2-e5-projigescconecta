using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.Oscs.DeleteOsc
{
    public class DeleteOscCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int OscId { get; set; }

        public DeleteOscCommand(int oscId)
        {
            OscId = oscId;
        }
    }

    internal sealed class DeleteOscCommandHandler : IRequestHandler<DeleteOscCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteOscCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeleteOscCommand request, CancellationToken cancellationToken)
        {
            var osc = await _context.Oscs.FindAsync(request.OscId);
            if (osc == null)
            {
                return new ValidationFailed(new[] { "OSC não encontrada." });
            }

            _context.Oscs.Remove(osc);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
