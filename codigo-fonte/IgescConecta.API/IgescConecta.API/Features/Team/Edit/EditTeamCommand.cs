using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.EditTeam
{
    public class EditTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int TeamId { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public int ProjectProgramId { get; set; }
        public int CourseId { get; set; }
    }

    internal sealed class EditTeamCommandHandler : IRequestHandler<EditTeamCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(EditTeamCommand request, CancellationToken cancellationToken)
        {
            if (request.Start >= request.Finish)
            {
                return new ValidationFailed(new[] { "A data de início deve ser anterior à data de término." });
            }

            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == request.TeamId && t.IsDeleted == false, cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { "Time não encontrado ou excluído." });
            }

            // Verifica se o novo ProjectProgram existe e não está deletado
            //var projectProgramExists = await _context.ProjectPrograms
            //    .AnyAsync(pp => pp.Id == request.ProjectProgramId && pp.IsDeleted == false, cancellationToken);

            //if (!projectProgramExists)
            //{
            //    return new ValidationFailed(new[] { "ProjectProgram não encontrado ou está inativo." });
            //}

            // Verifica se o novo Course existe e não está deletado
            //var courseExists = await _context.Courses
            //    .AnyAsync(c => c.Id == request.CourseId && c.IsDeleted == false, cancellationToken);

            //if (!courseExists)
            //{
            //    return new ValidationFailed(new[] { "Curso não encontrado ou está inativo." });
            //}

            // Bloqueia alteração de CourseId se já existem PersonTeams vinculados
            if (team.CourseId != request.CourseId)
            {
                var hasPersonTeams = await _context.PersonTeams
                    .AnyAsync(pt => pt.TeamId == request.TeamId, cancellationToken);

                if (hasPersonTeams)
                {
                    return new ValidationFailed(new[] { "Não é possível alterar o Curso pois existem pessoas vinculadas a este time." });
                }
            }
            
            // Comentado pois PersonOscs esta sem FK para Team
            // Bloqueia alteração de ProjectProgramId se já existem PersonOscs vinculados
            //if (team.ProjectProgramId != request.ProjectProgramId)
            //{
            //    var hasPersonOscs = await _context.PersonOscs
            //        .AnyAsync(po => po.TeamId == request.TeamId, cancellationToken);

            //    if (hasPersonOscs)
            //    {
            //        return new ValidationFailed(new[] { "Não é possível alterar o ProjectProgram pois existem OSCs vinculadas a este time." });
            //    }
            //}

            team.Start = request.Start;
            team.Finish = request.Finish;
            team.ProjectProgramId = request.ProjectProgramId;
            team.CourseId = request.CourseId;

            await _context.SaveChangesAsync(cancellationToken);

            return team.Id;
        }
    }
}