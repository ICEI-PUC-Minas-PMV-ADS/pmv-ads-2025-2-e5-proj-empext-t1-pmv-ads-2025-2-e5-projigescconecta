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
            var expr = ExpressionBuilder.GetExpression<Team>(request.Filters);
            
            var baseQuery = _context.Teams
                .Include(t => t.Course)
                .Include(t => t.ProjectPrograms)
                .Include(t => t.PersonTeams)
                .AsQueryable();

            var hasIsDeletedFilter = request.Filters?.Any(f =>
                string.Equals(f.PropertyName, "IsDeleted", StringComparison.OrdinalIgnoreCase)) == true;

            var query = hasIsDeletedFilter ? baseQuery.IgnoreQueryFilters() : baseQuery;

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

            // Conta usando a mesma base de consulta (com ou sem IgnoreQueryFilters)
            var totalRecords = await query.CountAsync(expr, cancellationToken);

            return new ListTeamViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }
}