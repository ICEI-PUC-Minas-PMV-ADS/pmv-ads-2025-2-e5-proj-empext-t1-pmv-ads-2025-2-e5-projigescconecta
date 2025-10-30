using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectPrograms.Delete
{
    public class DeleteProjectProgramResponse
    {
        public int ProjectProgramId { get; set; }
        public DeleteProjectProgramResponse(int id) => ProjectProgramId = id;
    }

    public class DeleteProjectProgramCommand
        : IRequest<Result<DeleteProjectProgramResponse, ValidationFailed>>
    {
        public int ProjectProgramId { get; set; }
    }

    internal sealed class DeleteProjectProgramCommandHandler
        : IRequestHandler<DeleteProjectProgramCommand, Result<DeleteProjectProgramResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteProjectProgramCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<DeleteProjectProgramResponse, ValidationFailed>> Handle(
            DeleteProjectProgramCommand request,
            CancellationToken cancellationToken)
        {
            var entity = await _context.ProjectPrograms
                .FirstOrDefaultAsync(x => x.Id == request.ProjectProgramId, cancellationToken);

            if (entity is null)
                return new ValidationFailed(new[] { "Projeto não encontrado." });

            if (entity.IsDeleted)
                return new ValidationFailed(new[] { "Projeto já está excluído." });

            entity.IsDeleted = true;

            await _context.SaveChangesAsync(cancellationToken);

            return new DeleteProjectProgramResponse(entity.Id);
        }
    }
}
