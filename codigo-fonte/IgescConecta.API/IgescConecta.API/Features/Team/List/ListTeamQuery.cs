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
        public int CourseId { get; set; }

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
            var query = _context.Teams

                .Where(t => t.IsDeleted == false)
                .AsQueryable();

            if (request.Filters != null && request.Filters.Any())
            {
                var expr = ExpressionBuilder.GetExpression<Team>(request.Filters);
                query = query.Where(expr);
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
                    CourseId = x.CourseId,
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