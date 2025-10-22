using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
    public class CreateTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public required string Name { get; set; }

        public string? LessonTime { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? Finish { get; set; }

        public List<int> PersonTeamsIds { get; set; } = [];
        public List<int> ProjectProgramsIds { get; set; } = [];
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
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ValidationFailed(new[] { "O nome da turma é obrigatório." });
                
            var courseExists = await _context.Courses
            .AnyAsync(c => c.Id == request.CourseId, cancellationToken);

            if (!courseExists)
                return new ValidationFailed(new[] { $"Curso com ID {request.CourseId} não encontrado." });

            if (request.Start >= request.Finish)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            if (request.ProjectProgramsIds.Any())
            {
                var programsExist = await _context.ProjectPrograms
                    .Where(p => request.ProjectProgramsIds.Contains(p.Id))
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken);

                var invalidIds = request.ProjectProgramsIds.Except(programsExist).ToList();

                if (invalidIds.Any())
                {
                    return new ValidationFailed(new[] { $"Projetos com IDs {string.Join(", ", invalidIds)} não encontrados." });
                }
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
                CourseId = request.CourseId
            };

            if (request.ProjectProgramsIds.Any())
            {
                var programs = await _context.ProjectPrograms.Where(p => request.ProjectProgramsIds.Contains(p.Id)).ToListAsync(cancellationToken);
                team.ProjectPrograms = programs;
            }

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
