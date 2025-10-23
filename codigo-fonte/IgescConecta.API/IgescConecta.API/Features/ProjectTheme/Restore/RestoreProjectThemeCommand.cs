using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectThemes.RestoreProjectTheme
{
    public class RestoreProjectThemeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectThemeId { get; set; }
    }

    internal sealed class RestoreProjectThemeCommandHandler
        : IRequestHandler<RestoreProjectThemeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public RestoreProjectThemeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            RestoreProjectThemeCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectThemes
                .Where(x => x.Id == request.ProjectThemeId)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Tema de Projeto não encontrado." });

            if (!entity.IsDeleted)
                return new ValidationFailed(new[] { "Tema de Projeto já está ativo." });

            entity.IsDeleted = false;
            entity.UpdatedAt = DateTime.UtcNow; // se usar UpdatedBy, preencher aqui

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }
    }
}
