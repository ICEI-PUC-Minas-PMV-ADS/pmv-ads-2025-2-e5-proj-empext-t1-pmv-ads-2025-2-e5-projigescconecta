using IgescConecta.API.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace IgescConecta.API.Features.Persons.GetPerson
{
    public record GetPersonQuery(int PersonId) : IRequest<PersonViewModel?>;

    internal sealed class GetPersonQueryHandler : IRequestHandler<GetPersonQuery, PersonViewModel?>
    {
        private readonly ApplicationDbContext _ctx;
        public GetPersonQueryHandler(ApplicationDbContext ctx) => _ctx = ctx;

        public async Task<PersonViewModel?> Handle(GetPersonQuery r, CancellationToken ct)
        {
            var p = await _ctx.Persons.AsNoTracking().FirstOrDefaultAsync(x => x.Id == r.PersonId, ct);
            if (p is null) return null;

            return new PersonViewModel
            {
                PersonId = p.Id,
                Name = p.Name,
                Email = p.Email,
                PersonalDocumment = p.PersonalDocumment,
                PrimaryPhone = p.PrimaryPhone,
                SecondaryPhone = p.SecondaryPhone,
                SecondaryEmail = p.SecondaryEmail,
                Education1 = p.Education1,
                Education2 = p.Education2,
                ProfessionalActivity = p.ProfessionalActivity,
                IsActive = p.IsActive
            };
        }
    }
}
