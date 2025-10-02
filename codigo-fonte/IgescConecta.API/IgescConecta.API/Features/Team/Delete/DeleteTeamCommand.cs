using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.DeleteTeam
{
    public class DeleteTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int TeamId { get; set; }
    }

    internal sealed class DeleteTeamCommandHandler : IRequestHandler<DeleteTeamCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
        {
            var team = await _context.Teams

                .FirstOrDefaultAsync(t => t.Id == request.TeamId && t.IsDeleted == false, cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { "Time não encontrado ou já excluído." });
            }

            team.IsDeleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return team.Id;
        }
    }
}