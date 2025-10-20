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

            if (entity == null)
            {
                return new ValidationFailed(new[] { "Tipo de Projeto não encontrado ou já está excluído." });
            }

            // Se houver regras de vínculo (ex.: ProjectProgram), validar aqui (similar ao Teams em Course)

            _context.ProjectTypes.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }
}
