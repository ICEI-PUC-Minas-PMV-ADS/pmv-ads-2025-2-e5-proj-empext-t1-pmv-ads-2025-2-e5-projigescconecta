using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.EditPersonTeam
{
    public class EditPersonTeamCommand : IRequest<Result<bool, ValidationFailed>>
    {
        public int Id { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    internal sealed class EditPersonTeamCommandHandler : IRequestHandler<EditPersonTeamCommand, Result<bool, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditPersonTeamCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<bool, ValidationFailed>> Handle(EditPersonTeamCommand request, CancellationToken cancellationToken)
        {
            
            if (request.MemberTypes == null || !request.MemberTypes.Any())
                return new ValidationFailed(new[] { "Pelo menos um tipo de membro deve ser especificado." });

            var personTeam = await _context.PersonTeams
                .FirstOrDefaultAsync(pt => pt.Id == request.Id, cancellationToken);

            if (personTeam == null)
                return new ValidationFailed(new[] { $"Vínculo com ID {request.Id} não encontrado." });

            // Atualiza apenas o campo MemberTypes
            personTeam.MemberTypes = request.MemberTypes;

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
                return true;
            }
            catch (DbUpdateException ex)
            {
                return new ValidationFailed(new[] { "Erro ao atualizar o vínculo no banco de dados." });
            }
        }
    }
}