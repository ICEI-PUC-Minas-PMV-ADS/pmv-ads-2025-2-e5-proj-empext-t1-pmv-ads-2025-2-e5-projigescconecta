using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.GetTeamById
{
    public class GetTeamQuery : IRequest<Result<Team, ValidationFailed>>
    {
        public int TeamId { get; set; }

        public GetTeamQuery(int id)
        {
            TeamId = id;
        }
    }

    internal sealed class GetTeamByIdQueryHandler : IRequestHandler<GetTeamQuery, Result<Team, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetTeamByIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Team, ValidationFailed>> Handle(GetTeamQuery request, CancellationToken cancellationToken)
        {
            var team = await _context.Teams
                .IgnoreQueryFilters()
                .Where(team => team.Id == request.TeamId)
                .Include(team => team.PersonTeams)
                .Include(team => team.ProjectPrograms)
                .Include(team => team.Course)
                .FirstOrDefaultAsync(cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { $"Turma com ID {request.TeamId} não encontrado ou está inativo." });
            }

            return team;
        }
    }
}