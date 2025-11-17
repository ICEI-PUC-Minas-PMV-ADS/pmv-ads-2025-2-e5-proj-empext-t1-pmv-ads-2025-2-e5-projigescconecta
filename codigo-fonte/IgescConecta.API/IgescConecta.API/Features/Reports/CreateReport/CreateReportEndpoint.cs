using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.CreateReport;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.CreateReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    [Authorize(Roles = "Admin,Editor")]
    public class CreateReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public CreateReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("CreateReport", Name = "CreateReport")]
        public async Task<ActionResult<CreateReportResponse>> Create([FromBody] CreateReportRequest request, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new CreateReportCommand
                {
                    Name = request.Name,
                    Description = request.Description,
                    RootEntity = request.RootEntity,
                    ReaderCanExecute = request.ReaderCanExecute,
                    Relations = request.Relations?.Select(r => new CreateReportRelationItem
                    {
                        FromEntity = r.FromEntity,
                        Path = r.Path,
                        Entity = r.Entity,
                        JoinType = r.JoinType,
                        Alias = r.Alias,
                        IsCollection = r.IsCollection
                    }).ToList() ?? [],
                    Fields = request.Fields?.Select(f => new CreateReportFieldItem
                    {
                        FieldPath = f.FieldPath,
                        Label = f.Label,
                        DataType = f.DataType,
                        FormatHint = f.FormatHint,
                        DisplayOrder = f.DisplayOrder
                    }).ToList() ?? [],
                    FilterQuestions = request.FilterQuestions?.Select(q => new CreateReportFilterQuestionItem
                    {
                        FieldPath = q.FieldPath,
                        DefaultOperator = q.DefaultOperator,
                        DataType = q.DataType,
                        IsRequired = q.IsRequired,
                        IsDateBase = q.IsDateBase,
                        Label = q.Label,
                        EnumOptionsJson = q.EnumOptionsJson
                    }).ToList() ?? [],
                    Sorts = request.Sorts?.Select(s => new CreateReportSortItem
                    {
                        FieldPath = s.FieldPath,
                        Direction = s.Direction,
                        Priority = s.Priority
                    }).ToList() ?? []
                }, ct);

                if (!result.IsSuccess) return BadRequest(result.Error);

                return Ok(new CreateReportResponse { Id = result.Value, Name = request.Name });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class CreateReportRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string RootEntity { get; set; }
        public bool ReaderCanExecute { get; set; }
        public List<CreateReportRelationRequest> Relations { get; set; } = [];
        public List<CreateReportFieldRequest> Fields { get; set; } = [];
        public List<CreateReportFilterQuestionRequest> FilterQuestions { get; set; } = [];
        public List<CreateReportSortRequest> Sorts { get; set; } = [];
    }

    public class CreateReportRelationRequest
    {
        public required string FromEntity { get; set; }
        public required string Path { get; set; }
        public required string Entity { get; set; }
        public required string JoinType { get; set; }
        public string? Alias { get; set; }
        public bool IsCollection { get; set; }
    }

    public class CreateReportFieldRequest
    {
        public required string FieldPath { get; set; }
        public required string Label { get; set; }
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CreateReportFilterQuestionRequest
    {
        public required string FieldPath { get; set; }
        public required string DefaultOperator { get; set; }
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public required string Label { get; set; }
        public string? EnumOptionsJson { get; set; }
    }

    public class CreateReportSortRequest
    {
        public required string FieldPath { get; set; }
        public SortDirection Direction { get; set; } = SortDirection.Asc;
        public int Priority { get; set; } = 1;
    }

    public class CreateReportResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}
