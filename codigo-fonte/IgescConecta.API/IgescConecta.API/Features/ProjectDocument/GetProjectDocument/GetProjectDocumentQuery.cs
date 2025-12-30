using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using ProjectDocumentEntity = IgescConecta.Domain.Entities.ProjectDocument;

namespace IgescConecta.API.Features.ProjectDocument.GetProjectDocument
{
    public class GetProjectDocumentResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public int ProjectProgramId { get; set; }
        public bool HasFile { get; set; }

        public GetProjectDocumentResponse()
        {
        }

        public GetProjectDocumentResponse(ProjectDocumentEntity entity)
        {
            Id = entity.Id;
            Name = entity.Name;
            Description = entity.Description;
            FileName = entity.FileName;
            ContentType = entity.ContentType;
            ProjectProgramId = entity.ProjectProgramId;
            HasFile = entity.FileData != null && entity.FileData.Length > 0;
        }
    }

    public class GetProjectDocumentQuery
        : IRequest<Result<GetProjectDocumentResponse, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    public class GetProjectDocumentFileResponse
    {
        public byte[] FileData { get; set; } = System.Array.Empty<byte>();
        public string FileName { get; set; } = string.Empty;
        public string ContentType { get; set; } = "application/pdf";
    }

    public class GetProjectDocumentFileQuery
        : IRequest<Result<GetProjectDocumentFileResponse, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class GetProjectDocumentQueryHandler
        : IRequestHandler<GetProjectDocumentQuery, Result<GetProjectDocumentResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetProjectDocumentQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<GetProjectDocumentResponse, ValidationFailed>> Handle(
            GetProjectDocumentQuery request,
            CancellationToken cancellationToken)
        {
            if (request.Id <= 0)
                return new ValidationFailed(new[] { "Id do documento inválido." });

            var entity = await _context.ProjectDocuments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Documento do projeto não encontrado." });

            var response = new GetProjectDocumentResponse(entity);
            return response;
        }
    }

    internal sealed class GetProjectDocumentFileQueryHandler
        : IRequestHandler<GetProjectDocumentFileQuery, Result<GetProjectDocumentFileResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetProjectDocumentFileQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<GetProjectDocumentFileResponse, ValidationFailed>> Handle(
            GetProjectDocumentFileQuery request,
            CancellationToken cancellationToken)
        {
            if (request.Id <= 0)
                return new ValidationFailed(new[] { "Id do documento inválido." });

            var entity = await _context.ProjectDocuments
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (entity == null)
                return new ValidationFailed(new[] { "Documento do projeto não encontrado." });

            if (entity.FileData == null || entity.FileData.Length == 0)
                return new ValidationFailed(new[] { "Documento não possui arquivo associado." });

            var response = new GetProjectDocumentFileResponse
            {
                FileData = entity.FileData,
                FileName = entity.FileName,
                ContentType = string.IsNullOrWhiteSpace(entity.ContentType)
                    ? "application/pdf"
                    : entity.ContentType
            };

            return response;
        }
    }
}
