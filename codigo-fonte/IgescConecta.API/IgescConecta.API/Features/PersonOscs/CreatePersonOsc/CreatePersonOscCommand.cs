using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonOscs.CreatePersonOsc
{
    public class CreatePersonOscCommand : IRequest<Result<CreatePersonOscResult, ValidationFailed>>
    {
        public int PersonId { get; set; }

        public int OscId { get; set; }
    }

    public class CreatePersonOscResult
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    internal sealed class CreatePersonOscCommandHandler : IRequestHandler<CreatePersonOscCommand, Result<CreatePersonOscResult, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreatePersonOscCommandHandler(ApplicationDbContext context)
        {
            _context = context; 
        }

        public async Task<Result<CreatePersonOscResult, ValidationFailed>> Handle(CreatePersonOscCommand request, CancellationToken cancellationToken)
        {
            var person = await _context.Persons
                .FindAsync(request.PersonId, cancellationToken);

            if (person == null)
                return new ValidationFailed(new[] { $"Pessoa com ID {request.PersonId} não encontrada" });

            var oscExists = await _context.Oscs
                .AnyAsync(o => o.Id == request.OscId, cancellationToken);

            if (!oscExists)
                return new ValidationFailed(new[] { $"Osc com ID {request.OscId} não econtrado" });

            var existsPersonOsc = await _context.PersonOscs
                .AnyAsync(pc => pc.PersonId == request.PersonId && pc.OscId == request.OscId, cancellationToken);

            if (existsPersonOsc)
                return new ValidationFailed(new[] { "Já existe um vínculo entre esta pessoa e esta OSC" });

            var personOsc = new PersonOsc
            {
                PersonId = request.PersonId,
                OscId = request.OscId,
            };

            await _context.PersonOscs.AddAsync(personOsc);
            await _context.SaveChangesAsync(cancellationToken);

            var result = new CreatePersonOscResult
            {
                Id = person.Id,
                Name = person.Name,
            };

            return result;
        }   
    }
}
