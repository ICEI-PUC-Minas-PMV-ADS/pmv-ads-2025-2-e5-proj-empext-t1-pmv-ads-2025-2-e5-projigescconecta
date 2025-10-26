using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.ListPersonTeam
{
    public class ListPersonTeamQuery : IRequest<List<PersonTeamDto>>
    {
        public int? TeamId { get; set; }
    }

    public class PersonTeamDto
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string PersonName { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public int? OscId { get; set; }
        public string OscName { get; set; }
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
            var query = _context.PersonTeams
                .Include(pt => pt.Person)
                .Include(pt => pt.Team)
                .Include(pt => pt.Osc)
                .AsNoTracking();

            // Filtrar por TeamId se fornecido
            if (request.TeamId.HasValue)
            {
                query = query.Where(pt => pt.TeamId == request.TeamId.Value);
            }

            var personTeams = await query.Select(pt => new PersonTeamDto
            {
                Id = pt.Id,
                PersonId = pt.PersonId,
                PersonName = pt.Person.Name,
                TeamId = pt.TeamId,
                TeamName = pt.Team.Name,
                OscId = pt.OscId,
                OscName = pt.Osc != null ? pt.Osc.Name : null,
                MemberTypes = pt.MemberTypes.ToList()
            }).ToListAsync(cancellationToken);

            return personTeams;
        }
    }
}