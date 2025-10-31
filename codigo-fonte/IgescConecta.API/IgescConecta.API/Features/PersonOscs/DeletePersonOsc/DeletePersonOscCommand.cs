using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.PersonOscs.DeletePersonOsc
{
    public class DeletePersonOscCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int PersonOscId { get; set; }

        public DeletePersonOscCommand(int personOscId)
        {
            PersonOscId = personOscId;
        }
    }

    internal sealed class DeletePersonOscCommandHandler : IRequestHandler<DeletePersonOscCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeletePersonOscCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeletePersonOscCommand request, CancellationToken cancellationToken)
        {
            var personOsc = await _context.PersonOscs.FindAsync(request.PersonOscId);

            if (personOsc == null)
            {
                return new ValidationFailed(new[] { "Person OSC not found" });
            }

            _context.PersonOscs.Remove(personOsc);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
