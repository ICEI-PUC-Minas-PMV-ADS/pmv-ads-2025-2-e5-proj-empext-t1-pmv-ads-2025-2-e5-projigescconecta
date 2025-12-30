using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.PublishReport
{
    public class PublishReportCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    internal sealed class PublishReportCommandHandler
        : IRequestHandler<PublishReportCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public PublishReportCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(PublishReportCommand request, CancellationToken ct)
        {
            var e = await _context.Reports
                .Include(r => r.Relations)
                .Include(r => r.Fields)
                .Include(r => r.FilterQuestions)
                .Include(r => r.Sorts)
                .FirstOrDefaultAsync(r => r.Id == request.Id, ct);

            if (e is null) throw new ArgumentException("Relatório não encontrado.");

            if (e.Fields.Count == 0) throw new ArgumentException("Selecione ao menos um campo para publicar.");

            var relPaths = e.Relations.Select(r => r.Path.Trim()).ToList();
            if (relPaths.Count != relPaths.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem relações duplicadas.");

            var fieldPaths = e.Fields.Select(f => f.FieldPath.Trim()).ToList();
            /*
            if (fieldPaths.Count != fieldPaths.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem campos (colunas) duplicados.");
            */
            var sortPriorities = e.Sorts.Select(s => s.Priority).ToList();
            if (sortPriorities.Count != sortPriorities.Distinct().Count())
                throw new ArgumentException("Existem prioridades de ordenação repetidas.");

            if (e.RootEntity.Equals("Project", StringComparison.OrdinalIgnoreCase))
            {
                bool hasDocsInRelations = relPaths.Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1).Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));
                bool hasDocsInFields = fieldPaths.Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1).Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));
                if (hasDocsInRelations || hasDocsInFields)
                    throw new ArgumentException("A relação/coluna 'Documentos' de Projeto não está disponível para relatórios.");
            }

            bool hasDateColumn = e.Fields.Any(f => f.DataType == FieldDataType.Date || f.DataType == FieldDataType.DateTime);
            int dateBases = e.FilterQuestions.Count(q => q.IsDateBase);
            if (hasDateColumn && dateBases == 0)
                throw new ArgumentException("Selecione uma 'Data base' porque o relatório possui colunas de data.");
            if (dateBases > 1)
                throw new ArgumentException("Existe mais de uma pergunta marcada como 'Data base'. Só é permitido uma por relatório.");

            e.Status = ReportStatus.Published;

            await _context.SaveChangesAsync(ct);
            return e.Id;
        }
    }
}
