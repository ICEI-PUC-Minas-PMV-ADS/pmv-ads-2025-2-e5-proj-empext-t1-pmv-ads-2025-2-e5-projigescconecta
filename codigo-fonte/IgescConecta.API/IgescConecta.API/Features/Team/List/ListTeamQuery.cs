using IgescConecta.API.Common.Extensions;
using IgescConecta.API.Common.Query;
using IgescConecta.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using IgescConecta.API.Data;

namespace IgescConecta.API.Features.Teams.ListTeam
{
    public class ListTeamViewModel : PaginationResponse<TeamViewModel>
    {
    }

    public class TeamViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Time { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public bool IsActive { get; set; }
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
            // Query base
            var query = _context.Teams.AsQueryable(); // não precisa de Include obrigatório

            // Aplica filtros se existirem
            if (request.Filters != null && request.Filters.Any())
            {
                var expr = ExpressionBuilder.GetExpression<Team>(request.Filters);
                if (expr != null)
                    query = query.Where(expr);
            }

            // Conta total de registros filtrados
            var totalRecords = await query.CountAsync(cancellationToken);

            // Paginação + ordenação
            var result = await query
                .OrderByDescending(x => x.Id)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Carrega os cursos associados de forma separada para evitar falhas se forem null
            var courseIds = result.Select(x => x.CourseId).Distinct().ToList();
            var courses = await _context.Courses
                .Where(c => courseIds.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, c => c.Name, cancellationToken);

            // Mapeia para ViewModel
            var teams = result.Select(x => new TeamViewModel
            {
                Id = x.Id,
                Name = x.Name,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                Time = x.Time,
                CourseId = x.CourseId,
                CourseName = courses.ContainsKey(x.CourseId) ? courses[x.CourseId] : null,
                IsActive = x.IsActive
            }).ToList();

            return new ListTeamViewModel
            {
                Items = teams,
                TotalItems = totalRecords
            };
        }

    }
}
