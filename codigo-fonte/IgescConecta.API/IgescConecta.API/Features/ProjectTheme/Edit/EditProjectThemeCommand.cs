using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectThemes.EditProjectTheme
{
    public class EditProjectThemeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectThemeId { get; set; }
        public string Name { get; set; }
    }

    internal sealed class EditProjectThemeCommandHandler
        : IRequestHandler<EditProjectThemeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditProjectThemeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            EditProjectThemeCommand request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ValidationFailed(new[] { "O nome do Tema de Projeto é obrigatório." });

            var entity = await _context.ProjectThemes
                .Where(x => x.Id == request.ProjectThemeId)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Tema de Projeto não encontrado." });

            entity.Name = request.Name;
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
