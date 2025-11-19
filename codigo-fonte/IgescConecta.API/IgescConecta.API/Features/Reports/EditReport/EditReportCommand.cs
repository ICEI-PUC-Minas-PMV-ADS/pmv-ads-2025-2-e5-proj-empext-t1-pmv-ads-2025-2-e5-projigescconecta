using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.EditReport
{
    public class EditReportCommand : IRequest<Result<int, ValidationFailed>>
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string RootEntity { get; set; }
        public bool ReaderCanExecute { get; set; }

        public List<EditReportRelationItem> Relations { get; set; } = [];
        public List<EditReportFieldItem> Fields { get; set; } = [];
        public List<EditReportFilterQuestionItem> FilterQuestions { get; set; } = [];
        public List<EditReportSortItem> Sorts { get; set; } = [];
    }

    public class EditReportRelationItem
    {
        public required string FromEntity { get; set; }
        public required string Path { get; set; }
        public required string Entity { get; set; }
        public required string JoinType { get; set; }
        public string? Alias { get; set; }
        public bool IsCollection { get; set; }
    }

    public class EditReportFieldItem
    {
        public required string FieldPath { get; set; }
        public required string Label { get; set; }
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class EditReportFilterQuestionItem
    {
        public required string FieldPath { get; set; }
        public required string DefaultOperator { get; set; }
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public required string Label { get; set; }
        public string? EnumOptionsJson { get; set; }
    }

    public class EditReportSortItem
    {
        public required string FieldPath { get; set; }
        public SortDirection Direction { get; set; } = SortDirection.Asc;
        public int Priority { get; set; } = 1;
    }

    internal sealed class EditReportCommandHandler
        : IRequestHandler<EditReportCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public EditReportCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(EditReportCommand request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Informe o nome do relatório.");
            if (string.IsNullOrWhiteSpace(request.RootEntity))
                throw new ArgumentException("Informe a entidade principal.");

            var entity = await _context.Reports
                .Include(r => r.Relations)
                .Include(r => r.Fields)
                .Include(r => r.FilterQuestions)
                .Include(r => r.Sorts)
                .FirstOrDefaultAsync(r => r.Id == request.Id, ct);

            if (entity is null)
                throw new ArgumentException("Relatório não encontrado.");

            var relKeys = request.Relations
                .Select(r => $"{r.FromEntity.Trim()}|{r.Path.Trim()}")
                .ToList();
            if (relKeys.Count != relKeys.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem relações duplicadas.");

            var fieldPaths = request.Fields.Select(f => f.FieldPath.Trim()).ToList();
            if (fieldPaths.Count != fieldPaths.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem campos (colunas) duplicados.");

            var sortPriorities = request.Sorts.Select(s => s.Priority).ToList();
            if (sortPriorities.Count != sortPriorities.Distinct().Count())
                throw new ArgumentException("Existem prioridades de ordenação repetidas.");

            if (request.RootEntity.Equals("Project", StringComparison.OrdinalIgnoreCase))
            {
                bool hasDocsInRelations = request.Relations
                    .Select(r => r.Path.Trim())
                    .Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                        .Skip(1)
                        .Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));

                bool hasDocsInFields = fieldPaths.Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1)
                    .Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));

                if (hasDocsInRelations || hasDocsInFields)
                    throw new ArgumentException("A relação/coluna 'Documentos' de Projeto não está disponível para relatórios.");
            }

            bool hasDateColumn = request.Fields.Any(f =>
                f.DataType == FieldDataType.Date ||
                f.DataType == FieldDataType.DateTime);

            int dateBases = request.FilterQuestions.Count(q => q.IsDateBase);
            if (hasDateColumn && dateBases == 0)
                throw new ArgumentException("Selecione uma 'Data base' porque o relatório possui colunas de data.");
            if (dateBases > 1)
                throw new ArgumentException("Existe mais de uma pergunta marcada como 'Data base'. Só é permitido uma por relatório.");

            entity.Name = request.Name.Trim();
            entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
            entity.RootEntity = request.RootEntity.Trim();
            entity.ReaderCanExecute = request.ReaderCanExecute;

            _context.ReportRelations.RemoveRange(entity.Relations);
            _context.ReportFields.RemoveRange(entity.Fields);
            _context.ReportFilterQuestions.RemoveRange(entity.FilterQuestions);
            _context.ReportSorts.RemoveRange(entity.Sorts);

            entity.Relations = request.Relations.Select(r => new ReportRelation
            {
                ReportId = entity.Id,
                FromEntity = r.FromEntity.Trim(),
                Path = r.Path.Trim(),
                Entity = r.Entity.Trim(),
                JoinType = r.JoinType.Trim(),
                Alias = string.IsNullOrWhiteSpace(r.Alias) ? string.Empty : r.Alias.Trim(),
                IsCollection = r.IsCollection
            }).ToList();

            entity.Fields = request.Fields.Select(f => new ReportField
            {
                ReportId = entity.Id,
                FieldPath = f.FieldPath.Trim(),
                Label = f.Label.Trim(),
                DataType = f.DataType,
                FormatHint = string.IsNullOrWhiteSpace(f.FormatHint) ? null : f.FormatHint.Trim(),
                DisplayOrder = f.DisplayOrder
            }).ToList();

            entity.FilterQuestions = request.FilterQuestions.Select(q => new ReportFilterQuestion
            {
                ReportId = entity.Id,
                FieldPath = q.FieldPath.Trim(),
                DefaultOperator = q.DefaultOperator.Trim(),
                DataType = q.DataType,
                IsRequired = q.IsRequired,
                IsDateBase = q.IsDateBase,
                Label = q.Label.Trim(),
                EnumOptionsJson = string.IsNullOrWhiteSpace(q.EnumOptionsJson) ? null : q.EnumOptionsJson.Trim()
            }).ToList();

            entity.Sorts = request.Sorts.Select(s => new ReportSort
            {
                ReportId = entity.Id,
                FieldPath = s.FieldPath.Trim(),
                Direction = s.Direction,
                Priority = s.Priority
            }).ToList();

            await _context.SaveChangesAsync(ct);
            return entity.Id;
        }
    }
}
