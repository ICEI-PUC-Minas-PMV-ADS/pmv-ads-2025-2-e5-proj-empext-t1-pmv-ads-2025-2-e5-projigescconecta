using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.GetReport;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.GetReport
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    public class GetReportEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public GetReportEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpGet("GetReport/{id:int}", Name = "GetReport")]
        public async Task<ActionResult<GetReportResponse>> Get([FromRoute] int id, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new GetReportQuery { Id = id }, ct);
                if (!result.IsSuccess) return BadRequest(result.Error);

                var r = result.Value;

                var response = new GetReportResponse
                {
                    Id = r.Id,
                    Name = r.Name,
                    Description = r.Description,
                    RootEntity = r.RootEntity,
                    Status = r.Status,
                    ReaderCanExecute = r.ReaderCanExecute,
                    Relations = r.Relations.Select(x => new GetReportRelationResponse
                    {
                        Path = x.Path,
                        IsCollection = x.IsCollection
                    }).ToList(),
                    Fields = r.Fields.Select(x => new GetReportFieldResponse
                    {
                        FieldPath = x.FieldPath,
                        Label = x.Label,
                        DataType = x.DataType,
                        FormatHint = x.FormatHint,
                        DisplayOrder = x.DisplayOrder
                    }).ToList(),
                    FilterQuestions = r.FilterQuestions.Select(x => new GetReportFilterQuestionResponse
                    {
                        FieldPath = x.FieldPath,
                        DefaultOperator = x.DefaultOperator,
                        DataType = x.DataType,
                        IsRequired = x.IsRequired,
                        IsDateBase = x.IsDateBase,
                        Label = x.Label,
                        EnumOptionsJson = x.EnumOptionsJson
                    }).ToList(),
                    Sorts = r.Sorts.Select(x => new GetReportSortResponse
                    {
                        FieldPath = x.FieldPath,
                        Direction = x.Direction,
                        Priority = x.Priority
                    }).ToList()
                };

                return Ok(response);
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

    public class GetReportResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string RootEntity { get; set; } = default!;
        public ReportStatus Status { get; set; }
        public bool ReaderCanExecute { get; set; }
        public List<GetReportRelationResponse> Relations { get; set; } = [];
        public List<GetReportFieldResponse> Fields { get; set; } = [];
        public List<GetReportFilterQuestionResponse> FilterQuestions { get; set; } = [];
        public List<GetReportSortResponse> Sorts { get; set; } = [];
    }

    public class GetReportRelationResponse
    {
        public string Path { get; set; } = default!;
        public bool IsCollection { get; set; }
    }

    public class GetReportFieldResponse
    {
        public string FieldPath { get; set; } = default!;
        public string Label { get; set; } = default!;
        public FieldDataType DataType { get; set; }
        public string? FormatHint { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class GetReportFilterQuestionResponse
    {
        public string FieldPath { get; set; } = default!;
        public string DefaultOperator { get; set; } = default!;
        public FieldDataType DataType { get; set; }
        public bool IsRequired { get; set; }
        public bool IsDateBase { get; set; }
        public string Label { get; set; } = default!;
        public string? EnumOptionsJson { get; set; }
    }

    public class GetReportSortResponse
    {
        public string FieldPath { get; set; } = default!;
        public SortDirection Direction { get; set; }
        public int Priority { get; set; }
    }
}
