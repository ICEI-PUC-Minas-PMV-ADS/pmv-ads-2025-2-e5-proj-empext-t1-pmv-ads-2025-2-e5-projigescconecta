using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
        public int? ProjectProgramId { get; set; }
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
                .Include(p => p.ProjectProgram)  
                .Include(c => c.Course)
                .Include(pt => pt.PersonTeams)
                .FirstOrDefaultAsync(cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { "Turma não encontrado ou excluída." });
            }

            var startDate = request.Start ?? team.Start;
            var finishDate = request.Finish ?? team.Finish;

            if (startDate >= finishDate)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            if (request.ProjectProgramId.HasValue)
            {
                var programExists = await _context.ProjectPrograms
                    .AnyAsync(p => p.Id == request.ProjectProgramId, cancellationToken);

                if (!programExists)
                    return new ValidationFailed(new[] { $"Projeto com ID {request.ProjectProgramId} não encontrado." });
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

            team.Name = request.Name ?? team.Name;
            team.LessonTime = request.LessonTime ?? team.LessonTime;
            team.Start = request.Start ?? team.Start;
            team.Finish = request.Finish ?? team.Finish;
            team.ProjectProgramId = request.ProjectProgramId ?? team.ProjectProgramId;
            team.CourseId = request.CourseId ?? team.CourseId;

            if (request.PersonTeamsIds != null &&
                !request.PersonTeamsIds.OrderBy(x => x)
                    .SequenceEqual(team.PersonTeams.Select(pt => pt.PersonId).OrderBy(x => x)))
            {
                team.PersonTeams.Clear();

                foreach (var personId in request.PersonTeamsIds)
                {
                    team.PersonTeams.Add(new PersonTeam
                    {
                        TeamId = team.Id,
                        PersonId = personId
                    });
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return team;
        }
    }
}