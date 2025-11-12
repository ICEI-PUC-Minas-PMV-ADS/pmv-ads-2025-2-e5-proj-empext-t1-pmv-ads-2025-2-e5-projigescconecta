using IgescConecta.API.Data;
using IgescConecta.API.Common.Query;
using IgescConecta.API.Common.Extensions;
using IgescConecta.Domain.Entities;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.ListPersonTeam
{
    public class ListPersonTeamQuery : IRequest<List<PersonTeamDto>>
    {
        public int? TeamId { get; set; }
        public List<Filter> Filters { get; set; } = new List<Filter>();
    }

    public class PersonTeamDto
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string PersonName { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
    }

    internal sealed class ListPersonTeamQueryHandler : IRequestHandler<ListPersonTeamQuery, List<PersonTeamDto>>
    {
        private readonly ApplicationDbContext _context;

        public ListPersonTeamQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<PersonTeamDto>> Handle(ListPersonTeamQuery request, CancellationToken cancellationToken)
        {
            var baseQuery = _context.PersonTeams
                .Include(pt => pt.Person)
                .Include(pt => pt.Team)
                .AsNoTracking()
                .AsQueryable();

            var isDeletedFilter = request.Filters?.FirstOrDefault(f => string.Equals(f.PropertyName, "IsDeleted", StringComparison.OrdinalIgnoreCase));
            var hasIsDeletedFilter = isDeletedFilter is not null;
            if (isDeletedFilter is not null && isDeletedFilter.Operation == Op.None)
            {
                isDeletedFilter.Operation = Op.Equals;
            }

            var query = hasIsDeletedFilter ? baseQuery.IgnoreQueryFilters() : baseQuery;

            if (request.TeamId.HasValue)
            {
                query = query.Where(pt => pt.TeamId == request.TeamId.Value);
            }

            var expr = ExpressionBuilder.GetExpression<PersonTeam>(request.Filters ?? new List<Filter>());
            query = query.Where(expr);

            var personTeams = await query.Select(pt => new PersonTeamDto
            {
                Id = pt.Id,
                PersonId = pt.PersonId,
                PersonName = pt.Person.Name,
                TeamId = pt.TeamId,
                TeamName = pt.Team.Name,
                MemberTypes = pt.MemberTypes.ToList()
            }).ToListAsync(cancellationToken);

            return personTeams;
        }
    }
}