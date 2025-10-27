using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace IgescConecta.API.Features.Teams.ListTeams
{
    public class ListTeamViewModel : PaginationResponse<ListTeamItemViewModel>
    {
    }

    public class ListTeamItemViewModel
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? LessonTime { get; set; }
        public DateTime? Start { get; set; }
        public DateTime? Finish { get; set; }
        public int ProjectPrograms { get; set; }
        public int CourseId { get; set; }
        public string? CourseName { get; set; }
        public int PersonTeamsCount { get; set; }
        public bool IsDeleted { get; set; }
    }
    
    public class ListTeamQuery : PaginationRequest, IRequest<ListTeamViewModel>
    {
        public ListTeamQuery(int pageNumber, int pageSize, List<Filter> filters)
            : base(pageNumber, pageSize, filters)
        {
        }
    }

    internal sealed class ListTeamQueryHandler : IRequestHandler<ListTeamQuery, ListTeamViewModel>
    {
        private readonly ApplicationDbContext _context;

        public ListTeamQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ListTeamViewModel> Handle(ListTeamQuery request, CancellationToken cancellationToken)
        {
            var expr = ExpressionBuilder.GetExpression<Team>(request.Filters);

            var query = _context.Teams
                .Include(t => t.Course)
                .Include(t => t.ProjectPrograms)
                .Include(t => t.PersonTeams)
                .AsQueryable();

            var result = await query
                .Where(expr)
                .Select(team => new ListTeamItemViewModel
                {
                    TeamId = team.Id,
                    Name = team.Name,
                    LessonTime = team.LessonTime,
                    Start = team.Start,
                    Finish = team.Finish,
                    ProjectPrograms = team.ProjectPrograms.Count,
                    CourseId = team.CourseId,
                    CourseName = team.Course != null ? team.Course.Name : "",
                    PersonTeamsCount = team.PersonTeams.Count,
                    IsDeleted = team.IsDeleted
                })
                .OrderByDescending(x => x.CourseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await _context.Teams.CountAsync(expr, cancellationToken);

            return new ListTeamViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}