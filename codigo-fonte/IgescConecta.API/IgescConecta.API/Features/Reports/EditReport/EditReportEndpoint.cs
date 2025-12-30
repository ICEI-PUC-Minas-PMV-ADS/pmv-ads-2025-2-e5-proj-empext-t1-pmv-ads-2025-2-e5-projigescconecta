using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.EditReport;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.EditReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    [Authorize(Roles = "Admin,Editor")]
    public class EditReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public EditReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPut("EditReport", Name = "EditReport")]
        public async Task<ActionResult<EditReportResponse>> Edit([FromBody] EditReportRequest request, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new EditReportCommand
                {
                    Id = request.Id,
                    Name = request.Name,
                    Description = request.Description,
                    RootEntity = request.RootEntity,
                    ReaderCanExecute = request.ReaderCanExecute,
                    Relations = request.Relations?.Select(r => new EditReportRelationItem
                    {
                        FromEntity = r.FromEntity,
                        Path = r.Path,
                        Entity = r.Entity,
                        JoinType = r.JoinType,
                        Alias = r.Alias,
                        IsCollection = r.IsCollection
                    }).ToList() ?? [],
                    Fields = request.Fields?.Select(f => new EditReportFieldItem
                    {
                        Entity = f.Entity,
                        FieldPath = f.FieldPath,
                        Label = f.Label,
                        DataType = f.DataType,
                        FormatHint = f.FormatHint,
                        DisplayOrder = f.DisplayOrder
                    }).ToList() ?? [],
                    FilterQuestions = request.FilterQuestions?.Select(q => new EditReportFilterQuestionItem
                    {
                        Entity = q.Entity,
                        FieldPath = q.FieldPath,
                        DefaultOperator = q.DefaultOperator,
                        DataType = q.DataType,
                        IsRequired = q.IsRequired,
                        IsDateBase = q.IsDateBase,
                        Label = q.Label,
                        EnumOptionsJson = q.EnumOptionsJson
                    }).ToList() ?? [],
                    Sorts = request.Sorts?.Select(s => new EditReportSortItem
                    {
                        Entity = s.Entity,
                        FieldPath = s.FieldPath,
                        Direction = s.Direction,
                        Priority = s.Priority
                    }).ToList() ?? []
                }, ct);

                if (!result.IsSuccess) return BadRequest(result.Error);

                return Ok(new EditReportResponse { Id = result.Value, Name = request.Name });
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

    public class EditReportRequest
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required string RootEntity { get; set; }
        public bool ReaderCanExecute { get; set; }
        public List<EditReportRelationRequest> Relations { get; set; } = [];
        public List<EditReportFieldRequest> Fields { get; set; } = [];
        public List<EditReportFilterQuestionRequest> FilterQuestions { get; set; } = [];
        public List<EditReportSortRequest> Sorts { get; set; } = [];
    }

    public class EditReportRelationRequest
    {
        public required string FromEntity { get; set; }
        public required string Path { get; set; }
        public required string Entity { get; set; }
        public required string JoinType { get; set; }
        public string? Alias { get; set; }
        public bool IsCollection { get; set; }
    }

    public class EditReportFieldRequest
    {
        public required string Entity { get; set; }
        public required string FieldPath { get; set; }
        public required string Label { get; set; }
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class EditReportFilterQuestionRequest
    {
        public required string Entity { get; set; }
        public required string FieldPath { get; set; }
        public required string DefaultOperator { get; set; }
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public required string Label { get; set; }
        public string? EnumOptionsJson { get; set; }
    }

    public class EditReportSortRequest
    {
        public required string Entity { get; set; }
        public required string FieldPath { get; set; }
        public SortDirection Direction { get; set; } = SortDirection.Asc;
        public int Priority { get; set; } = 1;
    }

    public class EditReportResponse
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }
}
