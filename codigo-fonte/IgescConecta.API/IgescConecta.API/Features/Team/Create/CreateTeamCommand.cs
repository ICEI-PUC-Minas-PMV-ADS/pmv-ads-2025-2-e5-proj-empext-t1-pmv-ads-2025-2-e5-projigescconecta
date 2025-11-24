using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
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

        public required int Year { get; set; }
        public required string Semester { get; set; }
        public required ModalityType ModalityType { get; set; }
        public required EventType EventType { get; set; }

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

            if (request.Year <= 0)
                return new ValidationFailed(new[] { "O ano é obrigatório e deve ser maior que zero." });

            if (string.IsNullOrWhiteSpace(request.Semester))
                return new ValidationFailed(new[] { "O semestre é obrigatório." });

            // Validação de enum obrigatório
            if (!Enum.IsDefined(typeof(ModalityType), request.ModalityType))
                return new ValidationFailed(new[] { "A modalidade é obrigatória e deve ser válida." });

            if (!Enum.IsDefined(typeof(EventType), request.EventType))
                return new ValidationFailed(new[] { "O tipo de evento é obrigatório e deve ser válido." });
                
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

            var team = new Team
            {
                Name = request.Name,
                LessonTime = request.LessonTime,
                Start = request.Start,
                Finish = request.Finish,
                Year = request.Year,
                Semester = request.Semester,
                ModalityType = request.ModalityType,
                EventType = request.EventType,
                CourseId = request.CourseId
            };

            if (request.ProjectProgramsIds.Any())
            {
                var programs = await _context.ProjectPrograms.Where(p => request.ProjectProgramsIds.Contains(p.Id)).ToListAsync(cancellationToken);
                team.ProjectPrograms = programs;
            }

            try
            {
                await _context.Teams.AddAsync(team, cancellationToken);
                await _context.SaveChangesAsync(cancellationToken);

                return team.Id;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao salvar a turma no banco de dados." });
            }
        }
    }
}
