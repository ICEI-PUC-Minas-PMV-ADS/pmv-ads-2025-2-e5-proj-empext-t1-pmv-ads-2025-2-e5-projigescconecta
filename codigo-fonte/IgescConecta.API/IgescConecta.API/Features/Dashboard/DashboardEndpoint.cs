using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Features.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace IgescConecta.API.Features.Dashboard
{
    [ApiAuthorize]
    [Route("/api/dashboard")]
    [ApiController]
    [ApiExplorerSettings(GroupName = "Dashboard")]
    public class DashboardEndpoint : ControllerBase
    {
        private readonly IMediator _mediator;

        public DashboardEndpoint(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("stats", Name = "GetDashboardStats")]
        public async Task<ActionResult<DashboardViewModel>> GetDashboardStats(
            [FromQuery] int courseId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var query = new DashboardQuery
            {
                CourseId = courseId,
                StartDate = startDate,
                EndDate = endDate
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}