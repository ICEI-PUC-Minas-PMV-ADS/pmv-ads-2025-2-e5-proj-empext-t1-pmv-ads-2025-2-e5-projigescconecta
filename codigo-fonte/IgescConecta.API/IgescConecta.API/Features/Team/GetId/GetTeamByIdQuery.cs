using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.GetTeamById
{
    public class GetTeamByIdResponse
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int ProjectProgramId { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public string CourseName { get; set; }
        public string ProjectProgramName { get; set; }
    }

    public class GetTeamByIdQuery : IRequest<Result<GetTeamByIdResponse, ValidationFailed>>
    {
        public int TeamId { get; set; }
    }

    internal sealed class GetTeamByIdQueryHandler : IRequestHandler<GetTeamByIdQuery, Result<GetTeamByIdResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetTeamByIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<GetTeamByIdResponse, ValidationFailed>> Handle(GetTeamByIdQuery request, CancellationToken cancellationToken)
        {
            // Busca apenas o Team primeiro sem joins
            var team = await _context.Teams
                .AsNoTracking()
                .Where(t => t.Id == request.TeamId && t.IsDeleted == false)
                .FirstOrDefaultAsync(cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { $"Time com ID {request.TeamId} não encontrado ou está inativo." });
            }

            // Busca Course e ProjectProgram separadamente (se existirem)
            string courseName = null;
            string projectProgramName = null;

            var course = await _context.Courses
                .AsNoTracking()
                .Where(c => c.Id == team.CourseId)
                .Select(c => c.Name)
                .FirstOrDefaultAsync(cancellationToken);

            var projectProgram = await _context.ProjectPrograms
                .AsNoTracking()
                .Where(p => p.Id == team.ProjectProgramId)
                .Select(p => p.Name)
                .FirstOrDefaultAsync(cancellationToken);

            return new GetTeamByIdResponse
            {
                Id = team.Id,
                CourseId = team.CourseId,
                ProjectProgramId = team.ProjectProgramId,
                Start = team.Start,
                Finish = team.Finish,
                IsDeleted = team.IsDeleted,
                CreatedAt = team.CreatedAt,
                CourseName = course,
                ProjectProgramName = projectProgram
            };
        }
    }
}