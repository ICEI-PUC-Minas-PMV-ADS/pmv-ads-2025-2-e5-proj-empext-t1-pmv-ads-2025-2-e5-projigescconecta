using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.CreateTeam
{
    public class CreateTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public int ProjectProgramId { get; set; }
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
            if (request.ProjectProgramId <= 0)
            {
                return new ValidationFailed(new[] { "O ID do ProjectProgram é obrigatório." });
            }
            if (request.CourseId <= 0)
            {
                return new ValidationFailed(new[] { "O ID do Curso é obrigatório." });
            }
            if (request.Start >= request.Finish)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            // Verifica se o ProjectProgram existe e não está deletado antes de criar o Team
            //var projectProgramExists = await _context.ProjectPrograms
            //    .AnyAsync(pp => pp.Id == request.ProjectProgramId && pp.IsDeleted == false, cancellationToken);

            //if (!projectProgramExists)
            //{
            //    return new ValidationFailed(new[] { "ProjectProgram não encontrado ou está inativo." });
            //}

            // Verifica se o Course existe e não está deletado antes de criar o Team
            //var courseExists = await _context.Courses
            //    .AnyAsync(c => c.Id == request.CourseId && c.IsDeleted == false, cancellationToken);

            //if (!courseExists)
            //{
            //    return new ValidationFailed(new[] { "Curso não encontrado ou está inativo." });
            //}

            var team = new Team
            {
                Start = request.Start,
                Finish = request.Finish,
                ProjectProgramId = request.ProjectProgramId,
                CourseId = request.CourseId
            };

            _context.Teams.Add(team);
            await _context.SaveChangesAsync(cancellationToken);

            return team.Id;
        }
    }
}