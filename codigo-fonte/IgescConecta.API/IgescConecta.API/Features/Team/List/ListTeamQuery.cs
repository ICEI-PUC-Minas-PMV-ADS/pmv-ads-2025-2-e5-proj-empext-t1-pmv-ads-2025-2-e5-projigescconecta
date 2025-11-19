using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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
        public int Year { get; set; }
        public string Semester { get; set; }
        public ModalityType ModalityType { get; set; }
        public EventType EventType { get; set; }
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
            var baseQuery = _context.Teams
                .AsNoTracking()
                .Include(t => t.Course)
                .Include(t => t.ProjectPrograms)
                .Include(t => t.PersonTeams)
                .AsQueryable();

            var hasIsDeletedFilter = request.Filters?.Any(f =>
                string.Equals(f.PropertyName, "IsDeleted", StringComparison.OrdinalIgnoreCase)) == true;

            var query = hasIsDeletedFilter ? baseQuery.IgnoreQueryFilters() : baseQuery;
            var ppFilter = request.Filters?
                .FirstOrDefault(f => string.Equals(f.PropertyName, "ProjectProgramId", StringComparison.OrdinalIgnoreCase));

            if (ppFilter is not null)
            {
                int projectProgramId = 0;
                try
                {
                    if (ppFilter.Value is System.Text.Json.JsonElement je)
                    {
                        if (je.ValueKind == System.Text.Json.JsonValueKind.Number)
                            projectProgramId = je.GetInt32();
                        else if (je.ValueKind == System.Text.Json.JsonValueKind.String && int.TryParse(je.GetString(), out var parsed))
                            projectProgramId = parsed;
                    }
                    else if (ppFilter.Value is int i)
                        projectProgramId = i;
                    else if (ppFilter.Value is long l)
                        projectProgramId = (int)l;
                    else if (ppFilter.Value is string s && int.TryParse(s, out var parsed))
                        projectProgramId = parsed;
                }
                catch { }

                if (projectProgramId > 0)
                {
                    query = query.Where(t => t.ProjectPrograms.Any(pp => pp.Id == projectProgramId));
                }
                request.Filters.Remove(ppFilter);
            }

            var expr = ExpressionBuilder.GetExpression<Team>(request.Filters ?? new System.Collections.Generic.List<Filter>());

            var result = await query
                .Where(expr)
                .Select(team => new ListTeamItemViewModel
                {
                    TeamId = team.Id,
                    Name = team.Name,
                    LessonTime = team.LessonTime,
                    Start = team.Start,
                    Finish = team.Finish,
                    Year = team.Year,
                    Semester = team.Semester,
                    ModalityType = team.ModalityType,
                    EventType = team.EventType,
                    ProjectPrograms = team.ProjectPrograms.Count(pp => !pp.IsDeleted),
                    CourseId = team.CourseId,
                    CourseName = team.Course != null ? team.Course.Name : "",
                    PersonTeamsCount = team.PersonTeams.Count(pt => !pt.IsDeleted),
                    IsDeleted = team.IsDeleted
                })
                .OrderByDescending(x => x.CourseId)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            var totalRecords = await query.CountAsync(expr, cancellationToken);

            return new ListTeamViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}