using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.CreatePersonTeam
{
    public class CreatePersonTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int PersonId { get; set; }
        public int TeamId { get; set; }
        public int? OscId { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    internal sealed class CreatePersonTeamCommandHandler : IRequestHandler<CreatePersonTeamCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreatePersonTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreatePersonTeamCommand request, CancellationToken cancellationToken)
        {
            var personExists = await _context.Persons
                .AnyAsync(p => p.Id == request.PersonId, cancellationToken);

            if (!personExists)
                return new ValidationFailed(new[] { $"Pessoa com ID {request.PersonId} não encontrada." });

            var teamExists = await _context.Teams
                .AnyAsync(t => t.Id == request.TeamId, cancellationToken);

            if (!teamExists)
                return new ValidationFailed(new[] { $"Turma com ID {request.TeamId} não encontrada." });

            if (request.OscId.HasValue)
            {
                var oscExists = await _context.Oscs
                    .AnyAsync(o => o.Id == request.OscId.Value, cancellationToken);

                if (!oscExists)
                    return new ValidationFailed(new[] { $"OSC com ID {request.OscId.Value} não encontrada." });
            }
            var existingPersonTeam = await _context.PersonTeams
                .AnyAsync(pt => pt.PersonId == request.PersonId && pt.TeamId == request.TeamId, cancellationToken);

            if (existingPersonTeam)
                return new ValidationFailed(new[] { "Já existe um vínculo entre esta pessoa e esta turma." });

            if (request.MemberTypes == null || !request.MemberTypes.Any())
                return new ValidationFailed(new[] { "Pelo menos um tipo de membro deve ser especificado." });

            var personTeam = new PersonTeam
            {
                PersonId = request.PersonId,
                TeamId = request.TeamId,
                OscId = request.OscId,
                MemberTypes = request.MemberTypes
            };

            try
            {
                await _context.PersonTeams.AddAsync(personTeam, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return personTeam.Id;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao salvar o vínculo no banco de dados." });
            }
        }
    }
}