using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;

namespace IgescConecta.API.Features.ProjectTypes.DeleteProjectType
{
    public class DeleteProjectTypeCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int ProjectTypeId { get; set; }
    }

    internal sealed class DeleteProjectTypeCommandHandler
        : IRequestHandler<DeleteProjectTypeCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteProjectTypeCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(
            DeleteProjectTypeCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectTypes.FindAsync(request.ProjectTypeId);

            if (entity == null || entity.IsDeleted)
                return new ValidationFailed(new[] { "Tipo de Projeto não encontrado ou já está excluído." });

            entity.IsDeleted = true;
            entity.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return entity.Id;
        }
    }
}
