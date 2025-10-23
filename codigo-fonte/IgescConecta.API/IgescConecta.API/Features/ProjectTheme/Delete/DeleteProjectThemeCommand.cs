using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.ProjectThemes.DeleteProjectTheme
{
    public class DeleteProjectThemeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectThemeId { get; set; }
    }

    internal sealed class DeleteProjectThemeCommandHandler
        : IRequestHandler<DeleteProjectThemeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteProjectThemeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            DeleteProjectThemeCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectThemes.FindAsync(request.ProjectThemeId);

            if (entity == null || entity.IsDeleted)
                return new ValidationFailed(new[] { "Tema de Projeto não encontrado ou já está excluído." });

            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }
    }
}