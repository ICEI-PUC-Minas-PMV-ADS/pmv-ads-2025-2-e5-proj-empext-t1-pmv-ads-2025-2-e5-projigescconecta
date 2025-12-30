using IgescConecta.API.Data;
using IgescConecta.API.Common.Validation;
using IgescConecta.Domain.Entities.Reporting;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Reports.GetReport
{
    public class GetReportQuery : IRequest<Result<GetReportDto, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    public class GetReportDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string RootEntity { get; set; } = default!;
        public ReportStatus Status { get; set; }
        public bool ReaderCanExecute { get; set; }
        public List<GetReportRelationItem> Relations { get; set; } = [];
        public List<GetReportFieldItem> Fields { get; set; } = [];
        public List<GetReportFilterQuestionItem> FilterQuestions { get; set; } = [];
        public List<GetReportSortItem> Sorts { get; set; } = [];
    }

    public class GetReportRelationItem
    {
        public string FromEntity { get; set; } = default!;
        public string Path { get; set; } = default!;
        public string Entity { get; set; } = default!;
        public string JoinType { get; set; } = default!;
        public string? Alias { get; set; }
        public bool IsCollection { get; set; }
    }

    public class GetReportFieldItem
    {
        public string Entity { get; set; } = default!;
        public string FieldPath { get; set; } = default!;
        public string Label { get; set; } = default!;
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class GetReportFilterQuestionItem
    {
        public string Entity { get; set; } = default!;
        public string FieldPath { get; set; } = default!;
        public string DefaultOperator { get; set; } = default!;
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public string Label { get; set; } = default!;
        public string? EnumOptionsJson { get; set; }
    }

    public class GetReportSortItem
    {
        public string Entity { get; set; } = default!;
        public string FieldPath { get; set; } = default!;
        public SortDirection Direction { get; set; }
        public int Priority { get; set; }
    }

    internal sealed class GetReportQueryHandler
        : IRequestHandler<GetReportQuery, Result<GetReportDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetReportQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<GetReportDto, ValidationFailed>> Handle(GetReportQuery request, CancellationToken cancellationToken)
        {
            var e = await _context.Reports
                .AsNoTracking()
                .Include(r => r.Relations)
                .Include(r => r.Fields)
                .Include(r => r.FilterQuestions)
                .Include(r => r.Sorts)
                .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

            if (e is null)
                throw new ArgumentException("Relatório não encontrado.");

            var dto = new GetReportDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                RootEntity = e.RootEntity,
                Status = e.Status,
                ReaderCanExecute = e.ReaderCanExecute,
                Relations = e.Relations
                    .OrderBy(x => x.Path)
                    .Select(x => new GetReportRelationItem
                    {
                        FromEntity = x.FromEntity,
                        Path = x.Path,
                        Entity = x.Entity,
                        JoinType = x.JoinType,
                        Alias = x.Alias,
                        IsCollection = x.IsCollection
                    })
                    .ToList(),
                Fields = e.Fields
                    .OrderBy(x => x.DisplayOrder)
                    .Select(x => new GetReportFieldItem
                    {
                        Entity = x.Entity,
                        FieldPath = x.FieldPath,
                        Label = x.Label,
                        DataType = x.DataType,
                        FormatHint = x.FormatHint,
                        DisplayOrder = x.DisplayOrder
                    }).ToList(),
                FilterQuestions = e.FilterQuestions
                    .OrderBy(x => x.Label)
                    .Select(x => new GetReportFilterQuestionItem
                    {
                        Entity = x.Entity,
                        FieldPath = x.FieldPath,
                        DefaultOperator = x.DefaultOperator,
                        DataType = x.DataType,
                        IsRequired = x.IsRequired,
                        IsDateBase = x.IsDateBase,
                        Label = x.Label,
                        EnumOptionsJson = x.EnumOptionsJson
                    }).ToList(),
                Sorts = e.Sorts
                    .OrderBy(x => x.Priority)
                    .Select(x => new GetReportSortItem
                    {
                        Entity = x.Entity,
                        FieldPath = x.FieldPath,
                        Direction = x.Direction,
                        Priority = x.Priority
                    }).ToList()
            };

            return dto;
        }
    }
}
