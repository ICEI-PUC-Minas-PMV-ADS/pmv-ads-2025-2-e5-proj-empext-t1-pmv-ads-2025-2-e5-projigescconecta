using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Data;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Teams.ListTeams
{
    public class ListTeamViewModel : PaginationResponse<TeamViewModel>
    {
    }

    public class TeamViewModel
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime Finish { get; set; }
        public int ProjectProgramId { get; set; }
        public string ProjectProgramName { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; }

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
            // Pega todos os teams ativos
            var query = _context.Teams
                .Where(t => !t.IsDeleted)
                .AsQueryable();

            if (request.Filters != null && request.Filters.Any())
            {
                try
                {
                    var expr = ExpressionBuilder.GetExpression<Team>(request.Filters);
                    if (expr != null)
                        query = query.Where(expr);
                }
                catch
                {
                    // Em dev
                }
            }

            var totalRecords = await query.CountAsync(cancellationToken);

            var result = await query
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(x => new TeamViewModel
                {
                    Id = x.Id,
                    Start = x.Start,
                    Finish = x.Finish,
                    ProjectProgramId = x.ProjectProgramId,
                    // Mock for dev
                    ProjectProgramName = _context.ProjectPrograms
                                        .Where(p => p.Id == x.ProjectProgramId)
                                        .Select(p => p.Name)
                                        .FirstOrDefault() ?? "Mock Project",
                    CourseId = x.CourseId,
                    CourseName = _context.Courses
                                    .Where(c => c.Id == x.CourseId)
                                    .Select(c => c.Name)
                                    .FirstOrDefault() ?? "Mock Course",
                    IsDeleted = x.IsDeleted
                })
                .ToListAsync(cancellationToken);

            return new ListTeamViewModel
            {
                Items = result,
                TotalItems = totalRecords
            };
        }
    }

}