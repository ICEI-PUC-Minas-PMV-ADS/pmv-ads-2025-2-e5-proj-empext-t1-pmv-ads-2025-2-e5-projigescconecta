using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using MediatR;

namespace IgescConecta.API.Features.Reports.CreateReport
{
    public class CreateReportCommand : IRequest<Result<int, ValidationFailed>>
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string RootEntity { get; set; }
        public bool ReaderCanExecute { get; set; }

        public List<CreateReportRelationItem> Relations { get; set; } = [];
        public List<CreateReportFieldItem> Fields { get; set; } = [];
        public List<CreateReportFilterQuestionItem> FilterQuestions { get; set; } = [];
        public List<CreateReportSortItem> Sorts { get; set; } = [];
    }

    public class CreateReportRelationItem
    {
        public required string FromEntity { get; set; }
        public required string Path { get; set; }
        public required string Entity { get; set; }
        public required string JoinType { get; set; }
        public string? Alias { get; set; }
        public bool IsCollection { get; set; }
    }

    public class CreateReportFieldItem
    {
        public required string FieldPath { get; set; }
        public required string Label { get; set; }
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CreateReportFilterQuestionItem
    {
        public required string FieldPath { get; set; }
        public required string DefaultOperator { get; set; }
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public required string Label { get; set; }
        public string? EnumOptionsJson { get; set; }
    }

    public class CreateReportSortItem
    {
        public required string FieldPath { get; set; }
        public SortDirection Direction { get; set; } = SortDirection.Asc;
        public int Priority { get; set; } = 1;
    }

    internal sealed class CreateReportCommandHandler
        : IRequestHandler<CreateReportCommand, Result<int, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public CreateReportCommandHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<int, ValidationFailed>> Handle(CreateReportCommand request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Name)) throw new ArgumentException("Informe o nome do relatório.");
            if (string.IsNullOrWhiteSpace(request.RootEntity)) throw new ArgumentException("Informe a entidade principal.");

            var relPaths = request.Relations.Select(r => r.Path.Trim()).ToList();
            if (relPaths.Count != relPaths.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem relações duplicadas.");

            var fieldPaths = request.Fields.Select(f => f.FieldPath.Trim()).ToList();
            if (fieldPaths.Count != fieldPaths.Distinct(StringComparer.OrdinalIgnoreCase).Count())
                throw new ArgumentException("Existem campos (colunas) duplicados.");

            var sortPriorities = request.Sorts.Select(s => s.Priority).ToList();
            if (sortPriorities.Count != sortPriorities.Distinct().Count())
                throw new ArgumentException("Existem prioridades de ordenação repetidas.");

            if (request.RootEntity.Equals("Project", StringComparison.OrdinalIgnoreCase))
            {
                bool hasDocsInRelations = relPaths.Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1).Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));
                bool hasDocsInFields = fieldPaths.Any(p => p.Split('.', StringSplitOptions.RemoveEmptyEntries)
                    .Skip(1).Any(seg => seg.Equals("Documents", StringComparison.OrdinalIgnoreCase)));
                if (hasDocsInRelations || hasDocsInFields)
                    throw new ArgumentException("A relação/coluna 'Documentos' de Projeto não está disponível para relatórios.");
            }

            bool hasDateColumn = request.Fields.Any(f => f.DataType == FieldDataType.Date || f.DataType == FieldDataType.DateTime);
            int dateBases = request.FilterQuestions.Count(q => q.IsDateBase);
            if (hasDateColumn && dateBases == 0)
                throw new ArgumentException("Selecione uma 'Data base' porque o relatório possui colunas de data.");
            if (dateBases > 1)
                throw new ArgumentException("Existe mais de uma pergunta marcada como 'Data base'. Só é permitido uma por relatório.");

            var entity = new Report
            {
                Name = request.Name.Trim(),
                Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
                RootEntity = request.RootEntity.Trim(),
                ReaderCanExecute = request.ReaderCanExecute
            };

            if (request.Relations.Any())
            {
                entity.Relations = request.Relations.Select(r => new ReportRelation
                {
                    FromEntity = r.FromEntity.Trim(),
                    Path = r.Path.Trim(),
                    Entity = r.Entity.Trim(),
                    JoinType = r.JoinType.Trim(),
                    Alias = string.IsNullOrWhiteSpace(r.Alias) ? null : r.Alias.Trim(),
                    IsCollection = r.IsCollection
                }).ToList();
            }

            if (request.Fields.Any())
            {
                entity.Fields = request.Fields.Select(f => new ReportField
                {
                    FieldPath = f.FieldPath.Trim(),
                    Label = f.Label.Trim(),
                    DataType = f.DataType,
                    FormatHint = string.IsNullOrWhiteSpace(f.FormatHint) ? null : f.FormatHint.Trim(),
                    DisplayOrder = f.DisplayOrder
                }).ToList();
            }

            if (request.FilterQuestions.Any())
            {
                entity.FilterQuestions = request.FilterQuestions.Select(q => new ReportFilterQuestion
                {
                    FieldPath = q.FieldPath.Trim(),
                    DefaultOperator = q.DefaultOperator.Trim(),
                    DataType = q.DataType,
                    IsRequired = q.IsRequired,
                    IsDateBase = q.IsDateBase,
                    Label = q.Label.Trim(),
                    EnumOptionsJson = string.IsNullOrWhiteSpace(q.EnumOptionsJson) ? null : q.EnumOptionsJson.Trim()
                }).ToList();
            }

            if (request.Sorts.Any())
            {
                entity.Sorts = request.Sorts.Select(s => new ReportSort
                {
                    FieldPath = s.FieldPath.Trim(),
                    Direction = s.Direction,
                    Priority = s.Priority
                }).ToList();
            }

            await _context.Reports.AddAsync(entity, ct);
            await _context.SaveChangesAsync(ct);

            return entity.Id;
        }
    }
}
