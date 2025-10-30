using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Restore
{
    public class RestoreProjectProgramResponse
    {
        public int ProjectProgramId { get; set; }
        public RestoreProjectProgramResponse(int id) => ProjectProgramId = id;
    }

    public class RestoreProjectProgramCommand
        : IRequest<Result<RestoreProjectProgramResponse, ValidationFailed>>
    {
        public int ProjectProgramId { get; set; }
    }

    internal sealed class RestoreProjectProgramCommandHandler
        : IRequestHandler<RestoreProjectProgramCommand, Result<RestoreProjectProgramResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public RestoreProjectProgramCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<RestoreProjectProgramResponse, ValidationFailed>> Handle(
            RestoreProjectProgramCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectPrograms
                .FirstOrDefaultAsync(x => x.Id == request.ProjectProgramId, cancellationToken);

            if (entity is null)
                return new ValidationFailed(new[] { "Projeto não encontrado." });

            if (!entity.IsDeleted)
                return new ValidationFailed(new[] { "Projeto já está ativo." });

            var conflict = await _context.ProjectPrograms.AnyAsync(
                p => !p.IsDeleted && p.OscId == entity.OscId && p.TeamId == entity.TeamId,
                cancellationToken);

            if (conflict)
                return new ValidationFailed(new[] { "Não é possível restaurar: já existe um projeto desta OSC nesta Turma." });

            entity.IsDeleted = false;

            await _context.SaveChangesAsync(cancellationToken);

            return new RestoreProjectProgramResponse(entity.Id);
        }
    }
}

