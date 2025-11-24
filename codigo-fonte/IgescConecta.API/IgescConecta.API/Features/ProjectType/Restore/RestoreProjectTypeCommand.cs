using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectTypes.RestoreProjectType
{
    public class RestoreProjectTypeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectTypeId { get; set; }
    }

    internal sealed class RestoreProjectTypeCommandHandler
        : IRequestHandler<RestoreProjectTypeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public RestoreProjectTypeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            RestoreProjectTypeCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectTypes
                .Where(x => x.Id == request.ProjectTypeId)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Tipo de Projeto não encontrado." });

            if (!entity.IsDeleted)
                return new ValidationFailed(new[] { "Tipo de Projeto já está ativo." });

            entity.IsDeleted = false;
            entity.UpdatedAt = DateTime.UtcNow; // se usar UpdatedBy, preencher aqui

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }
    }
}
