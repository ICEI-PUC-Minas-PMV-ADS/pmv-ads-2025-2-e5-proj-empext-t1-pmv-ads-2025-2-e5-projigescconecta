using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Reports.ListReports;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Reports.ListReports
{
    [ApiAuthorize]
    [Route("/api/report")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Reports")]
    public class ListReportsEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;
        public ListReportsEndpoint(IMediator mediator) => _mediator = mediator;

        [HttpPost("ListReports", Name = "ListReports")]
        public async Task<ActionResult<ListReportsResponse>> List([FromBody] ListReportsRequest request, CancellationToken ct)
        {
            try
            {
                var result = await _mediator.Send(new ListReportsQuery
                {
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    Filters = request.Filters ?? []
                }, ct);

                if (!result.IsSuccess) return BadRequest(result.Error);

                var r = result.Value;

                return Ok(new ListReportsResponse
                {
                    PageNumber = r.PageNumber,
                    PageSize = r.PageSize,
                    TotalCount = r.TotalCount,
                    Items = r.Items.Select(i => new ListReportItemResponse
                    {
                        Id = i.Id,
                        Name = i.Name,
                        RootEntity = i.RootEntity,
                        Status = i.Status,
                        ReaderCanExecute = i.ReaderCanExecute,
                        CreatedAt = i.CreatedAt,
                        UpdatedAt = i.UpdatedAt
                    }).ToList()
                });
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

    public class ListReportsRequest
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public List<Filter>? Filters { get; set; } = [];
    }

    public class ListReportsResponse
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public List<ListReportItemResponse> Items { get; set; } = [];
    }

    public class ListReportItemResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string RootEntity { get; set; } = default!;
        public IgescConecta.Domain.Enums.ReportStatus Status { get; set; }
        public bool ReaderCanExecute { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

