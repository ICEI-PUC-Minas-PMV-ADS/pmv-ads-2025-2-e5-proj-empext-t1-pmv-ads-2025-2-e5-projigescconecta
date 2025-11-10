using IgescConecta.API.Common.Validation;
using IgescConecta.API.Data;
using IgescConecta.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.PersonTeams.GetPersonTeamById
{
    public class GetPersonTeamByIdQuery : IRequest<Result<PersonTeamDetailDto, ValidationFailed>>
    {
        public int Id { get; set; }
    }

    public class PersonTeamDetailDto
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string PersonName { get; set; }
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public List<MemberType> MemberTypes { get; set; } = new List<MemberType>();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    internal sealed class GetPersonTeamByIdQueryHandler : IRequestHandler<GetPersonTeamByIdQuery, Result<PersonTeamDetailDto, ValidationFailed>>
    {
        private readonly ApplicationDbContext _context;

        public GetPersonTeamByIdQueryHandler(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Result<PersonTeamDetailDto, ValidationFailed>> Handle(GetPersonTeamByIdQuery request, CancellationToken cancellationToken)
        {
            var personTeam = await _context.PersonTeams
                .Include(pt => pt.Person)
                .Include(pt => pt.Team)
                .AsNoTracking()
                .FirstOrDefaultAsync(pt => pt.Id == request.Id, cancellationToken);

            if (personTeam == null)
                return new ValidationFailed(new[] { $"Vínculo com ID {request.Id} não encontrado." });

            var dto = new PersonTeamDetailDto
            {
                Id = personTeam.Id,
                PersonId = personTeam.PersonId,
                PersonName = personTeam.Person.Name,
                TeamId = personTeam.TeamId,
                TeamName = personTeam.Team.Name,
                MemberTypes = personTeam.MemberTypes.ToList(),
                CreatedAt = personTeam.CreatedAt,
                UpdatedAt = personTeam.UpdatedAt
            };

            return dto;
        }
    }
}