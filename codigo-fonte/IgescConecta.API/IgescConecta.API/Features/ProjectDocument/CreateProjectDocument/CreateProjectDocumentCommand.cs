using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ProjectDocumentEntity = IgescConecta.Domain.Entities.ProjectDocument;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.CreateProjectDocument
{
    public class CreateProjectDocumentRequest
    {
        public int ProjectProgramId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public IFormFile? File { get; set; }
    }

    public class CreateProjectDocumentResponse
    {
        public int ProjectDocumentId { get; set; }

        public CreateProjectDocumentResponse(int id)
        {
            ProjectDocumentId = id;
        }
    }

    public class CreateProjectDocumentCommand
        : IRequest<Result<CreateProjectDocumentResponse, ValidationFailed>>
    {
        public CreateProjectDocumentRequest Body { get; set; } = new CreateProjectDocumentRequest();
    }

    internal sealed class CreateProjectDocumentCommandHandler
        : IRequestHandler<CreateProjectDocumentCommand, Result<CreateProjectDocumentResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;
        private const long MaxFileSizeBytes = 10L * 1024L * 1024L;

        public CreateProjectDocumentCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<CreateProjectDocumentResponse, ValidationFailed>> Handle(
            CreateProjectDocumentCommand request,
            CancellationToken cancellationToken)
        {
            var body = request.Body;
            var errors = new List<string>();

            if (body.ProjectProgramId <= 0)
                errors.Add("Projeto inválido.");

            if (string.IsNullOrWhiteSpace(body.Name))
                errors.Add("O nome do documento é obrigatório.");

            if (body.File == null || body.File.Length == 0)
                errors.Add("O arquivo PDF é obrigatório.");

            if (body.File != null)
            {
                if (body.File.Length > MaxFileSizeBytes)
                    errors.Add("O arquivo PDF é muito grande. Tamanho máximo permitido é de 10 MB.");

                var contentType = body.File.ContentType?.ToLowerInvariant() ?? string.Empty;
                if (!contentType.Contains("pdf"))
                    errors.Add("Apenas arquivos em formato PDF são permitidos.");
            }

            if (errors.Count > 0)
                return new ValidationFailed(errors.ToArray());

            var projectExists = await _context.ProjectPrograms
                .AnyAsync(p => p.Id == body.ProjectProgramId && !p.IsDeleted, cancellationToken);

            if (!projectExists)
                return new ValidationFailed(new[] { "Projeto não encontrado." });

            var documentsCount = await _context.ProjectDocuments
                .CountAsync(d => d.ProjectProgramId == body.ProjectProgramId && !d.IsDeleted, cancellationToken);

            if (documentsCount >= 5)
                return new ValidationFailed(new[] { "O projeto já possui o número máximo de 5 documentos." });

            byte[] fileBytes;
            using (var ms = new MemoryStream())
            {
                await body.File!.CopyToAsync(ms, cancellationToken);
                fileBytes = ms.ToArray();
            }

            var document = new ProjectDocumentEntity
            {
                ProjectProgramId = body.ProjectProgramId,
                Name = body.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(body.Description) ? null : body.Description.Trim(),
                FileName = Path.GetFileName(body.File!.FileName),
                ContentType = string.IsNullOrWhiteSpace(body.File.ContentType)
                    ? "application/pdf"
                    : body.File.ContentType,
                FileData = fileBytes,
                IsDeleted = false
            };

            _context.ProjectDocuments.Add(document);
            await _context.SaveChangesAsync(cancellationToken);

            return new CreateProjectDocumentResponse(document.Id);
        }
    }
}
