using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.ProjectTypes.EditProjectType
{
    public class EditProjectTypeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectTypeId { get; set; }
        public string Name { get; set; }
    }

    internal sealed class EditProjectTypeCommandHandler
        : IRequestHandler<EditProjectTypeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditProjectTypeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            EditProjectTypeCommand request,
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return new ValidationFailed(new[] { "O nome do Tipo de Projeto é obrigatório." });

            var entity = await _context.ProjectTypes
                .Where(x => x.Id == request.ProjectTypeId && !x.IsDeleted)
                .FirstOrDefaultAsync(cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Tipo de Projeto não encontrado." });

            entity.Name = request.Name.Trim();
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }
    }
}
