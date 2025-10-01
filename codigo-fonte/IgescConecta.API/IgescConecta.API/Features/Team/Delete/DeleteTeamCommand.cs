using MediatR;
using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.Teams.DeleteTeam
{
    public class DeleteTeamCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int TeamId { get; set; }
        public int DeactivatedByUserId { get; set; } // Quem está desativando
    }

    public sealed class DeleteTeamCommandHandler : IRequestHandler<DeleteTeamCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(DeleteTeamCommand request, CancellationToken cancellationToken)
        {
            var team = await _context.Teams
                .FirstOrDefaultAsync(t => t.Id == request.TeamId && t.IsActive, cancellationToken);

            if (team == null)
            {
                return new ValidationFailed(new[] { "Turma não encontrada ou já está desativada." });
            }

            // Soft delete
            team.IsActive = false;
            team.DeactivatedAt = DateTime.UtcNow;
            team.DeactivatedBy = request.DeactivatedByUserId;
            team.UpdatedAt = DateTime.UtcNow;
            team.UpdatedBy = request.DeactivatedByUserId;

            await _context.SaveChangesAsync(cancellationToken);

            return team.Id;
        }
    }
}
