using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ProjectDocumentEntity = IgescConecta.Domain.Entities.ProjectDocument;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.UpdateProjectDocument
{
    public class UpdateProjectDocumentRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
    }

    public class UpdateProjectDocumentResponse
    {
        public int ProjectDocumentId { get; set; }

        public UpdateProjectDocumentResponse(int id)
        {
            ProjectDocumentId = id;
        }
    }

    public class UpdateProjectDocumentCommand
        : IRequest<Result<UpdateProjectDocumentResponse, ValidationFailed>>
    {
        public int Id { get; set; }
        public UpdateProjectDocumentRequest Body { get; set; } = new UpdateProjectDocumentRequest();
    }

    internal sealed class UpdateProjectDocumentCommandHandler
        : IRequestHandler<UpdateProjectDocumentCommand, Result<UpdateProjectDocumentResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;
        private const long MaxFileSizeBytes = 10L * 1024L * 1024L;

        public UpdateProjectDocumentCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<UpdateProjectDocumentResponse, ValidationFailed>> Handle(
            UpdateProjectDocumentCommand request,
            CancellationToken cancellationToken)
        {
            var body = request.Body;
            var errors = new List<string>();

            if (request.Id <= 0)
                errors.Add("Documento inválido.");

            if (string.IsNullOrWhiteSpace(body.Name))
                errors.Add("O nome do documento é obrigatório.");

            if (body.File != null)
            {
                if (body.File.Length <= 0)
                    errors.Add("O arquivo PDF é inválido.");

                if (body.File.Length > MaxFileSizeBytes)
                    errors.Add("O arquivo PDF é muito grande. Tamanho máximo permitido é de 10 MB.");

                var contentType = body.File.ContentType?.ToLowerInvariant() ?? string.Empty;
                if (!contentType.Contains("pdf"))
                    errors.Add("Apenas arquivos em formato PDF são permitidos.");
            }

            if (errors.Count > 0)
                return new ValidationFailed(errors.ToArray());

            var document = await _context.ProjectDocuments
                .FirstOrDefaultAsync(d => d.Id == request.Id && !d.IsDeleted, cancellationToken);

            if (document == null)
                return new ValidationFailed(new[] { "Documento não encontrado." });

            document.Name = body.Name.Trim();
            document.Description = string.IsNullOrWhiteSpace(body.Description)
                ? null
                : body.Description.Trim();

            if (body.File != null)
            {
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    await body.File.CopyToAsync(ms, cancellationToken);
                    fileBytes = ms.ToArray();
                }

                document.FileData = fileBytes;
                document.FileName = Path.GetFileName(body.File.FileName);
                document.ContentType = string.IsNullOrWhiteSpace(body.File.ContentType)
                    ? "application/pdf"
                    : body.File.ContentType;
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new UpdateProjectDocumentResponse(document.Id);
        }
    }
}

