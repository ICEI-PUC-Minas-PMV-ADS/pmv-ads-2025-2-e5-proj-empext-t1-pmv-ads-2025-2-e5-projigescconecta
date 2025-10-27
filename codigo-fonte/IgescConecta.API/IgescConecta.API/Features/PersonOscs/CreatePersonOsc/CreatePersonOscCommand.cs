using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonOscs.CreatePersonOsc
{
    public class CreatePersonOscCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int PersonId { get; set; }

        public int OscId { get; set; }
    }

    internal sealed class CreatePersonOscCommandHandler : IRequestHandler<CreatePersonOscCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreatePersonOscCommandHandler(ApplicationDbContext context)
        {
            _context = context; 
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreatePersonOscCommand request, CancellationToken cancellationToken)
        {
            var personExists = await _context.Persons
                .AnyAsync(p => p.Id == request.PersonId, cancellationToken);

            if (!personExists)
                return new ValidationFailed(new[] { $"Pessoa com ID {request.PersonId} não encontrada" });

            var oscExists = await _context.Oscs
                .AnyAsync(o => o.Id == request.OscId, cancellationToken);

            if (!oscExists)
                return new ValidationFailed(new[] { $"Osc com ID {request.OscId} não econtrado" });

            var existsPersonOsc = await _context.PersonOscs
                .AnyAsync(pc => pc.PersonId == request.OscId && pc.OscId == request.OscId, cancellationToken);

            if (!existsPersonOsc)
                return new ValidationFailed(new[] { "Já existe um vínculo entre esta pessoa e esta OSC" });

            var personOsc = new PersonOsc
            {
                PersonId = request.PersonId,
                OscId = request.OscId,
            };

            await _context.PersonOscs.AddAsync(personOsc);
            await _context.SaveChangesAsync();
            return personOsc.Id;
        }   
    }
}
