using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.DeletePersonTeam
{
    public class DeletePersonTeamCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class DeletePersonTeamCommandHandler : IRequestHandler<DeletePersonTeamCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeletePersonTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(DeletePersonTeamCommand request, CancellationToken cancellationToken)
        {
            var personTeam = await _context.PersonTeams
                .FirstOrDefaultAsync(pt => pt.Id == request.Id, cancellationToken);

            if (personTeam == null)
                return new ValidationFailed(new[] { $"Vínculo com ID {request.Id} não encontrado." });

            try
            {
                _context.PersonTeams.Remove(personTeam);
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao excluir o vínculo do banco de dados." });
            }
        }
    }
}