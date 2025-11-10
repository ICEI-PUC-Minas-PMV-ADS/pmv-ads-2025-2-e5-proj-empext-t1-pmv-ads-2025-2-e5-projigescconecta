using System.Runtime.CompilerServices;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.CreatePersonTeam
{
    public class CreatePersonTeamCommand : IRequest<Result<CreatePersonTeamResponse, ValidationFailed>>
    {
        public int PersonId { get; set; }
        public int TeamId { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    internal sealed class CreatePersonTeamCommandHandler : IRequestHandler<CreatePersonTeamCommand, Result<CreatePersonTeamResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreatePersonTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<CreatePersonTeamResponse, ValidationFailed>> Handle(CreatePersonTeamCommand request, CancellationToken cancellationToken)
        {
            var person = await _context.Persons
                .FirstOrDefaultAsync(p => p.Id == request.PersonId, cancellationToken);

            if (person == null)
                return new ValidationFailed(new[] { $"Pessoa com ID {request.PersonId} não encontrada" });

            var teamExists = await _context.Teams
                .AnyAsync(t => t.Id == request.TeamId, cancellationToken);

            if (!teamExists)
                return new ValidationFailed(new[] { $"Turma com ID {request.TeamId} não encontrada." });

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
                MemberTypes = request.MemberTypes
            };

            // Regra de negócio: se incluir Estudante, deve existir vínculo PersonOsc para a pessoa.
            if (request.MemberTypes.Contains(MemberType.Student))
            {
                var personOsc = await _context.PersonOscs
                    .AsNoTracking()
                    .FirstOrDefaultAsync(po => po.PersonId == request.PersonId, cancellationToken);

                if (personOsc == null)
                    return new ValidationFailed(new[] { "Para membros do tipo Participante, é necessário vínculo prévio da pessoa com uma OSC." });

                personTeam.PersonOscId = personOsc.Id;
            }
            else
            {
                personTeam.PersonOscId = null;
            }

            try
            {
                await _context.PersonTeams.AddAsync(personTeam, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                var response = new CreatePersonTeamResponse
                {
                    Id = personTeam.Id,
                    Name = person.Name,
                };

                return response;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao salvar o vínculo no banco de dados." });
            }
        }
    }
}