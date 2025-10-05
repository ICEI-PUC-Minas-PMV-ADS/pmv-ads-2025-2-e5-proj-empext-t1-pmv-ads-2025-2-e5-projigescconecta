using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
    public class CreateTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public string? Name { get; set; }

        public string? LessonTime { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public List<int> PersonTeamsIds { get; set; } = [];
        public int? ProjectProgramId { get; set; }
        public int CourseId { get; set; }
    }

    internal sealed class CreateTeamCommandHandler : IRequestHandler<CreateTeamCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateTeamCommand request, CancellationToken cancellationToken)
        {
            var courseExists = await _context.Courses
            .AnyAsync(c => c.Id == request.CourseId, cancellationToken);

            if (!courseExists)
                return new ValidationFailed(new[] { $"Curso com ID {request.CourseId} não encontrado." });

            if (request.Start >= request.Finish)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            if (request.ProjectProgramId.HasValue)
            {
                var programExists = await _context.ProjectPrograms
                    .AnyAsync(p => p.Id == request.ProjectProgramId, cancellationToken);

                if (!programExists)
                    return new ValidationFailed(new[] { $"Programa com ID {request.ProjectProgramId} não encontrado." });
            }

            if (request.PersonTeamsIds.Any())
            {
                var personsExist = await _context.Persons
                    .Where(p => request.PersonTeamsIds.Contains(p.Id))
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken);

                var invalidIds = request.PersonTeamsIds.Except(personsExist).ToList();

                if (invalidIds.Any())
                {
                    return new ValidationFailed(new[] { $"Pessoas com IDs {string.Join(", ", invalidIds)} não encontradas." });
                }
            }

            var team = new Team
            {
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                ProjectProgramId = request.ProjectProgramId,
                CourseId = request.CourseId
            };

            try
            {
                // Salva o Team primeiro para gerar o Id
                await _context.Teams.AddAsync(team, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                //Adiciona os PersonTeams com TeamId garantido
                if (request.PersonTeamsIds.Any())
                {
                    foreach (var personId in request.PersonTeamsIds)
                    {
                        team.PersonTeams.Add(new PersonTeam
                        {
                            TeamId = team.Id,
                            PersonId = personId
                        });
                    }

                    await _context.SaveChangesAsync(cancellationToken);
                }

                return team.Id;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao salvar a turma no banco de dados." });
            }
        }
    }
}
