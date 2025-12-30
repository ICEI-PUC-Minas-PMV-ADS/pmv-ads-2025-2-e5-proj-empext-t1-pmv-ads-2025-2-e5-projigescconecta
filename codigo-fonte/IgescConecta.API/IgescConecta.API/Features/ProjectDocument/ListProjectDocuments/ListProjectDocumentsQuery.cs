using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace IgescConecta.API.Features.ProjectDocument.ListProjectDocuments
{
    public class ListProjectDocumentsRequest
    {
        public int ProjectProgramId { get; set; }
    }

    public class ProjectDocumentListItem
    {
        public int ProjectDocumentId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string FileName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ListProjectDocumentsResponse
    {
        public IList<ProjectDocumentListItem> Items { get; set; } = new List<ProjectDocumentListItem>();
    }

    public class ListProjectDocumentsQuery
        : IRequest<Result<ListProjectDocumentsResponse, ValidationFailed>>
    {
        public ListProjectDocumentsRequest Query { get; set; } = new();
    }

    internal sealed class ListProjectDocumentsQueryHandler
        : IRequestHandler<ListProjectDocumentsQuery, Result<ListProjectDocumentsResponse, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public ListProjectDocumentsQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<ListProjectDocumentsResponse, ValidationFailed>> Handle(
            ListProjectDocumentsQuery request,
            CancellationToken cancellationToken)
        {
            var projectProgramId = request.Query.ProjectProgramId;
            var errors = new List<string>();

            if (projectProgramId <= 0)
                errors.Add("Projeto inválido.");

            if (errors.Count > 0)
                return new ValidationFailed(errors.ToArray());

            var projectExists = await _context.ProjectPrograms
                .AnyAsync(p => p.Id == projectProgramId && !p.IsDeleted, cancellationToken);

            if (!projectExists)
                return new ValidationFailed(new[] { "Projeto não encontrado." });

            var docs = await _context.ProjectDocuments
                .Where(d => d.ProjectProgramId == projectProgramId && !d.IsDeleted)
                .OrderByDescending(d => d.CreatedAt)
                .Select(d => new ProjectDocumentListItem
                {
                    ProjectDocumentId = d.Id,
                    Name = d.Name,
                    Description = d.Description,
                    FileName = d.FileName,
                    CreatedAt = d.CreatedAt
                })
                .ToListAsync(cancellationToken);

            var response = new ListProjectDocumentsResponse
            {
                Items = docs
            };

            return response;
        }
    }
}
