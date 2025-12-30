using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.DeleteProjectDocument
{
    public class DeleteProjectDocumentCommand
        : IRequest<Result<Unit, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class DeleteProjectDocumentCommandHandler
        : IRequestHandler<DeleteProjectDocumentCommand, Result<Unit, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public DeleteProjectDocumentCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit, ValidationFailed>> Handle(
            DeleteProjectDocumentCommand request,
            CancellationToken cancellationToken)
        {
            if (request.Id <= 0)
                return new ValidationFailed(new[] { "Id do documento inválido." });

            var entity = await _context.ProjectDocuments
                .FirstOrDefaultAsync(x => x.Id == request.Id && !x.IsDeleted, cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Documento não encontrado." });

            _context.ProjectDocuments.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
