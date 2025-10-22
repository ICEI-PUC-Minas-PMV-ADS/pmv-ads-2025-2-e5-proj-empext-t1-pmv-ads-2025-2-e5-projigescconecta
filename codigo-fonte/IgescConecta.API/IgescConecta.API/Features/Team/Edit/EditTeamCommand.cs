using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.Teams.EditTeam
{
    public class EditTeamCommand : IRequest<Result<Team, ValidationFailed>>
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public List<int>? PersonTeamsIds { get; set; }
        public List<int>? ProjectProgramIds { get; set; }
        public int? CourseId { get; set; }
    }

    internal sealed class EditTeamCommandHandler : IRequestHandler<EditTeamCommand, Result<Team, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Team, ValidationFailed>> Handle(EditTeamCommand request, CancellationToken cancellationToken)
        {
            var team = await _context.Teams
                .Where(t => t.Id == request.TeamId)
                .Include(p => p.ProjectPrograms)  
                .Include(c => c.Course)
                .Include(pt => pt.PersonTeams)
                .FirstOrDefaultAsync(cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { "Turma não encontrada ou excluída." });
            }

            var startDate = request.Start ?? team.Start;
            var finishDate = request.Finish ?? team.Finish;

            if (startDate.HasValue && finishDate.HasValue && startDate >= finishDate)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            if (request.ProjectProgramIds != null && request.ProjectProgramIds.Any())
            {
                var programsExist = await _context.ProjectPrograms
                    .Where(p => request.ProjectProgramIds.Contains(p.Id))
                    .Select(p => p.Id)
                    .ToListAsync(cancellationToken);

                var invalidIds = request.ProjectProgramIds.Except(programsExist).ToList();

                if (invalidIds.Any())
                    return new ValidationFailed(new[] { $"Projetos com IDs {string.Join(", ", invalidIds)} não encontrados." });
            }

            if (request.CourseId.HasValue)
            {
                var courseExists = await _context.Courses
                    .AnyAsync(c => c.Id == request.CourseId, cancellationToken);

                if (!courseExists)
                    return new ValidationFailed(new[] { $"Projeto com ID {request.CourseId} não encontrado." });
            }

            if (request.PersonTeamsIds != null && request.PersonTeamsIds.Any())
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

            if (request.Name != null && string.IsNullOrWhiteSpace(request.Name))
            {
                return new ValidationFailed(new[] { "O nome da turma é obrigatório." });
            }
            
            team.Name = request.Name ?? team.Name;
            team.LessonTime = request.LessonTime ?? team.LessonTime;
            team.Start = request.Start ?? team.Start;
            team.Finish = request.Finish ?? team.Finish;
            team.CourseId = request.CourseId ?? team.CourseId;

            // Atualizar ProjectPrograms
            if (request.ProjectProgramIds != null)
            {
                team.ProjectPrograms.Clear();

                if (request.ProjectProgramIds.Any())
                {
                    var projectPrograms = await _context.ProjectPrograms
                        .Where(pp => request.ProjectProgramIds.Contains(pp.Id))
                        .ToListAsync(cancellationToken);

                    foreach (var projectProgram in projectPrograms)
                    {
                        team.ProjectPrograms.Add(projectProgram);
                    }
                }
            }

            // Atualizar PersonTeams
            if (request.PersonTeamsIds != null &&
                !request.PersonTeamsIds.OrderBy(x => x)
                    .SequenceEqual(team.PersonTeams.Select(pt => pt.PersonId).OrderBy(x => x)))
            {
                team.PersonTeams.Clear();

                foreach (var personId in request.PersonTeamsIds)
                {
                    team.PersonTeams.Add(new PersonTeam
                    {
                        PersonId = personId,
                        TeamId = team.Id
                    });
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return team;
        }
    }
}